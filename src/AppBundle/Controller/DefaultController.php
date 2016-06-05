<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    /**
     * @Route("/demo", name="homepage")
     */
    public function indexAction()
    {
        return $this->render('default/index.html.twig');
    }
    /**
     * @Route("/", name="webapp")
     */
    public function appAction()
    {
        $em = $this->getDoctrine()->getManager();
        $entity = $em->getRepository('AppBundle:Ajuste')->getAjustes();

        return $this->render('default/app.html.twig', array(
            'config' => array_merge(array(
                'webapp_' => '...',
            ), $entity)
        ));
    }
}
