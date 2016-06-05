<?php

namespace AppBundle\Controller;

use AppBundle\Entity\User;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\Put;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Util\Codes;
use FOS\RestBundle\View\View as FOSView;
use FOS\UserBundle\Event\FilterUserResponseEvent;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Model\UserInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Voryx\RESTGeneratorBundle\Controller\VoryxController;

/**
 * Controller managing the registration
 *
 */
class ResettingRESTController extends VoryxController
{
    /**
     * Request reset user password: show form
     *
     * @View(statusCode=201, serializerEnableMaxDepthChecks=true)
     *
     * @Get(path="/resetting/request", name="_resetting")
     *
     * @param Request $request
     *
     * @return Response
     */
    public function requestAction()
    {
    }

    /**
     * Request reset user password: submit form and send email
     *
     * @View(statusCode=201, serializerEnableMaxDepthChecks=true)
     *
     * @Post(path="/resetting/send-email", name="_resetting")
     *
     * @param Request $request
     *
     * @return Response
     */
    public function sendEmailAction(Request $request)
    {
         $username = $request->request->get('username');

        /** @var $user UserInterface */
        $user = $this->get('fos_user.user_manager')->findUserByUsernameOrEmail($username);

        try {
            if (null === $user) {
                $request->attributes->set('_redirect_route_name', 'request_resetting');

                return FOSView::create(
                    array('errors' => array('invalid_username' => $username)),
                    Codes::HTTP_INTERNAL_SERVER_ERROR
                );
            }

            if ($user->isPasswordRequestNonExpired($this->container->getParameter('fos_user.resetting.token_ttl'))) {
                $request->attributes->set('_redirect_route_name', 'send_email_resetting');

                return  array();
            }

            if (null === $user->getConfirmationToken()) {
                /** @var $tokenGenerator \FOS\UserBundle\Util\TokenGeneratorInterface */
                $tokenGenerator = $this->get('fos_user.util.token_generator');
                $user->setConfirmationToken($tokenGenerator->generateToken());
            }

            $this->get('app.mailer.twig_swift')->sendResettingEmailMessage($user);

            $user->setPasswordRequestedAt(new \DateTime());
            $this->get('fos_user.user_manager')->updateUser($user);

            $request->attributes->set('_redirect_route_name', 'check_email_resetting');

            return array('email' => $this->getObfuscatedEmail($user));

        } catch (\Exception $e) {
            return FOSView::create($e->getMessage(), Codes::HTTP_INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Tell the user to check his email provider
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @Get(path="/resetting/check-email", name="_resetting")
     *
     * @return Response
     */
    public function checkEmailAction(Request $request)
    {
    }

    /**
     * Reset user password
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @Get(path="/resetting/reset/{token}", name="_resetting")
     *
     */
    public function getResetAction(Request $request, $token)
    {
        /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');

        $user = $userManager->findUserByConfirmationToken($token);

        if (null === $user) {
            throw new NotFoundHttpException(sprintf('The user with "confirmation token" does not exist for value "%s"', $token));
        }

        return $user;
    }

    /**
     * Reset user password
     *
     * @View(statusCode=201, serializerEnableMaxDepthChecks=true)
     *
     * @Put(path="/resetting/reset/{token}", name="_resetting")
     *
     */
    public function putResetAction(Request $request, $token)
    {
        $resettingType = $this->get('app.resetting.form.type');
        /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');
        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $user = $userManager->findUserByConfirmationToken($token);

        if (null === $user) {
            throw new NotFoundHttpException(sprintf('The user with "confirmation token" does not exist for value "%s"', $token));
        }

        /*$event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }*/

        try {
            $request->setMethod('PATCH'); //Treat all PUTs as PATCH
            $form = $this->createForm($resettingType, $user, array(
                'method' => $request->getMethod(),
                'validation_groups' => array('ResetPassword', 'Default'),
            ));
            $this->removeExtraFields($request, $form);
            $form->handleRequest($request);
            if ($form->isValid()) {
                $event = new FormEvent($form, $request);
                $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_SUCCESS, $event);

                $userManager->updateUser($user);

                if (null === $response = $event->getResponse()) {
                    $request->attributes->set('_redirect_route_name', 'profile_show');
                }

                //$dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_COMPLETED, new FilterUserResponseEvent($user, $request, $response));
                return $user;
            }

            return FOSView::create(array('errors' => $form->getErrors()), Codes::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return FOSView::create($e->getMessage(), Codes::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get the truncated email displayed when requesting the resetting.
     * The default implementation only keeps the part following @ in the address.
     *
     * @param \FOS\UserBundle\Model\UserInterface $user
     */
    public function getObfuscatedEmail(UserInterface $user)
    {
        $email = $user->getEmail();
        if (false !== $pos = strpos($email, '@')) {
            $email = '...' . substr($email, $pos);
        }

        return $email;
    }
}
