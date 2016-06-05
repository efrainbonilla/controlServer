<?php

namespace AppBundle\Controller;

use AppBundle\AppEvents;
use AppBundle\Entity\User;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;
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
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Voryx\RESTGeneratorBundle\Controller\VoryxController;

/**
 * Controller managing the registration
 *
 */
class RegistrationRESTController extends VoryxController
{
    /**
     * Register
     *
     * @View(statusCode=201, serializerEnableMaxDepthChecks=true)
     *
     * @Post(path="/register", name="_registration")
     *
     * @param Request $request
     *
     * @return Response
     */
    public function registerAction(Request $request)
    {
        $registrationType = $this->get('app.registration.form.type');
        /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');
        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $entity = $userManager->createUser();
        $entity->setEnabled(true);

        $event = new GetResponseUserEvent($entity, $request);
        $dispatcher->dispatch(FOSUserEvents::REGISTRATION_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        try {
            $form = $this->createForm($registrationType, $entity, array(
                'method' => $request->getMethod(),
                'validation_groups' => array('Registration', 'Default'),
            ));
            $this->removeExtraFields($request, $form);
            $form->handleRequest($request);
            if ($form->isValid()) {
                $event = new FormEvent($form, $request);
                $dispatcher->dispatch(AppEvents::REGISTRATION_SUCCESS, $event);

                $userManager->updateUser($entity);

                if (null === $response = $event->getResponse()) {
                    $url = $this->generateUrl('confirmed_registration');
                    $response = array('url' => $url);
                }

                //$dispatcher->dispatch(FOSUserEvents::REGISTRATION_COMPLETED, new FilterUserResponseEvent($user, $request, $response));
                return $entity;
            }

            return FOSView::create(array('errors' => $form->getErrors()), Codes::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return FOSView::create($e->getMessage(), Codes::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Tell the user to check his email provider
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @Get(path="/register/check-email", name="_registration")
     *
     * @return Response
     */
    public function checkEmailAction()
    {
        $email = $this->get('session')->get('fos_user_send_confirmation_email/email');
        //$this->get('session')->remove('fos_user_send_confirmation_email/email');
        $user = $this->get('fos_user.user_manager')->findUserByEmail(/*'efrainbonilla.dev@hotmail.com'*/ $email);

        if (null === $user) {
            throw new NotFoundHttpException(sprintf('The user with email "%s" does not exist', $email));
        }

        return $user;
    }

    /**
     * Tell the user his account is now confirmed
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @Get(path="/register/confirmed", name="_registration")
     */
    public function confirmedAction()
    {
        $user = $this->getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        return $user;
    }

    /**
     * Receive the confirmation token from user email provider, login the user
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @Get(path="/register/confirm/{token}", name="_registration")
     *
     */
    public function confirmAction(Request $request, $token)
    {
        /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');

        $user = $userManager->findUserByConfirmationToken($token);

        if (null === $user) {
            throw new NotFoundHttpException(sprintf('The user with confirmation token "%s" does not exist', $token));
        }

        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $user->setConfirmationToken(null);
        $user->setEnabled(true);

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(AppEvents::REGISTRATION_CONFIRM, $event);

        $userManager->updateUser($user);

        if (null === $response = $event->getResponse()) {
            $url = $this->generateUrl('confirmed_registration');
            /*$response = new RedirectResponse($url);*/
        }

        //autenticate user
        /*$dispatcher->dispatch(FOSUserEvents::REGISTRATION_CONFIRMED, new FilterUserResponseEvent($user, $request, $response));

        return $response;*/

        return $user;
    }
}
