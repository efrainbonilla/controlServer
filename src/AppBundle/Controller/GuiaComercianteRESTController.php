<?php

namespace AppBundle\Controller;

use AppBundle\Entity\ClienteProducto;
use AppBundle\Entity\ComercianteProducto;
use AppBundle\Entity\GuiaComerciante;
use AppBundle\Entity\TransporteCliente;
use AppBundle\Entity\VehiculoTransporte;
use AppBundle\Form\GuiaComercianteType;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use FOS\RestBundle\Controller\Annotations\RouteResource;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Request\ParamFetcherInterface;
use FOS\RestBundle\Util\Codes;
use FOS\RestBundle\View\View as FOSView;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Voryx\RESTGeneratorBundle\Controller\VoryxController;

/**
 * GuiaComerciante controller.
 * @RouteResource("GuiaComerciante")
 */
class GuiaComercianteRESTController extends VoryxController
{
    /**
     * Get a GuiaComerciante entity
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @return Response
     *
     */
    public function getAction(GuiaComerciante $entity)
    {
        return $entity;
    }
    /**
     * Get all GuiaComerciante entities.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @param ParamFetcherInterface $paramFetcher
     *
     * @return Response
     *
     * @QueryParam(name="q", nullable=true, description="Search text.")
     * @QueryParam(name="offset", requirements="\d+", nullable=true, description="Offset from which to start listing notes.")
     * @QueryParam(name="limit", requirements="\d+", default="20", description="How many notes to return.")
     * @QueryParam(name="order_by", nullable=true, array=true, description="Order by fields. Must be an array ie. &order_by[name]=ASC&order_by[description]=DESC")
     * @QueryParam(name="filters", nullable=true, array=true, description="Filter by fields. Must be an array ie. &filters[id]=3")
     * @QueryParam(name="filters_operator", default="LIKE %...%", description="Option filter operator.")
     */
    public function cgetAction(ParamFetcherInterface $paramFetcher, Request $request)
    {
        try {
            $q = $paramFetcher->get('q');
            $offset = $paramFetcher->get('offset');
            $limit = $paramFetcher->get('limit');
            $order_by = $paramFetcher->get('order_by');
            $filters = !is_null($paramFetcher->get('filters')) ? $paramFetcher->get('filters') : array();
            $filters_operator = $paramFetcher->get('filters_operator');

            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('AppBundle:GuiaComerciante');
            if (!empty($q)) {
                $filters_ = array(
                    'codi' => '',
                );

                $filters = array_merge($filters, $filters_);

                $adapter = $entity->findByAdapter($filters, $order_by, $q, $filters_operator);
                $nbResults = $adapter->getNbResults();
                $entities = $adapter->getSlice($offset, $limit)->getArrayCopy();
            } else {
                $nbResults = $entity->getNbResults();
                $entities = ($nbResults > 0) ? $entity->findBy($filters, $order_by, $limit, $offset) : array();
            }

            if ($entities) {
                $request->attributes->set('_x_total_count', $nbResults);

                return $entities;
            }

            return FOSView::create('Not Found', Codes::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return FOSView::create($e->getMessage(), Codes::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Create a GuiaComerciante entity.
     *
     * @View(statusCode=201, serializerEnableMaxDepthChecks=true)
     *
     * @param Request $request
     *
     * @return Response
     *
     */
    public function postAction(Request $request)
    {

        $vehiculo = $request->request->get('vehiculo');

        if (!(is_array($vehiculo) && count($vehiculo) > 0)) {
            return FOSView::create('Error: formulario incompleto.', Codes::HTTP_INTERNAL_SERVER_ERROR);
        }
        $handle_error = false;
        $handle_msg = '';
        foreach ($vehiculo as $keyFirst => $valueFirst) {
            if (isset($valueFirst['cliente']) && is_array($valueFirst['cliente']) && (count($valueFirst['cliente']) > 0)) {
                foreach ($valueFirst['cliente'] as $keySecond => $valueSecond) {
                    if (isset($valueSecond['producto']) && is_array($valueSecond['producto']) && count($valueSecond['producto']) > 0) {
                        foreach ($valueSecond['producto'] as $keyThird => $valueThird) {
                            foreach ($valueThird as $key => $value) {
                                if (!in_array($key, array('prod', 'prodMarca', 'presUni', 'presNum', 'presMed', 'presCant', 'presMmed', 'precCompra', 'precVenta', 'obs'))) {
                                    $handle_error = true;
                                    $handle_msg = "$key campo invalido.";
                                    break;
                                }
                            }
                            if ($handle_error) {
                                break;
                            }
                        }
                        if ($handle_error) {
                            break;
                        }
                    } else {
                        $handle_error = true;
                        $handle_msg = 'Indice [producto] incompleto en formulario cliente #' . ($keySecond + 1) . ' vehículo #' . ($keyFirst + 1);
                        break;
                    }
                }
                if ($handle_error) {
                    break;
                }
            } else {
                $handle_error = true;
                $handle_msg = 'Indice [cliente] incompleto en formulario vehículo #' . ($keyFirst + 1);
                break;
            }
        }

        if ($handle_error) {
            return FOSView::create('Error:' . $handle_msg, Codes::HTTP_INTERNAL_SERVER_ERROR);
        }

        $em = $this->getDoctrine()->getManager();

        $entity = new GuiaComerciante();

        foreach ($vehiculo as $keyFirst => $valueFirst) {
            $entityVehiculoTransporte = new VehiculoTransporte();
            $entityVehiculoTransporte->setVehiculo($em->getRepository('AppBundle:Vehiculo')->find($valueFirst['vehiculo']));
            $entityVehiculoTransporte->setConductor($em->getRepository('AppBundle:Persona')->find($valueFirst['persona']));
            $entity->addTransporte($entityVehiculoTransporte);

            foreach ($valueFirst['cliente'] as $keySecond => $valueSecond) {
                $entityTranporteCliente = new TransporteCliente();
                $entityTranporteCliente->setMercantil($em->getRepository('AppBundle:Mercantil')->find($valueSecond['cliente']));
                $entityVehiculoTransporte->addCliente($entityTranporteCliente);

                foreach ($valueSecond['producto'] as $keyThird => $valueThird) {
                    $entityClienteProducto = new ClienteProducto();
                    $entityClienteProducto->setProducto($em->getRepository('AppBundle:Xproducto')->find($valueThird['prod']));
                    $entityClienteProducto->setProdmarca($em->getRepository('AppBundle:ProductoMarca')->find($valueThird['prodMarca']));
                    $entityClienteProducto->setPresUni($valueThird['presUni']);
                    $entityClienteProducto->setPresNum($valueThird['presNum']);
                    $entityClienteProducto->setMedida($em->getRepository('AppBundle:Xmedida')->find($valueThird['presMed']));
                    $entityClienteProducto->setPresCant($valueThird['presCant']);
                    $entityClienteProducto->setMmedida($em->getRepository('AppBundle:Xmedida')->find($valueThird['presMmed']));
                    $entityClienteProducto->setCompra($valueThird['precCompra']);
                    $entityClienteProducto->setVenta($valueThird['precVenta']);
                    $entityClienteProducto->setObs(isset($valueThird['obs'])?: null);
                    $entityTranporteCliente->addProducto($entityClienteProducto);
                }
            }
        }

        $entity->setUser($this->getUserData());
        $entity->setFechsali(new \DateTime($request->request->get('fechsali')));

        $form = $this->createForm(get_class(new GuiaComercianteType()), $entity, array("method" => $request->getMethod()));
        $this->removeExtraFields($request, $form);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $entity;
        }

        return FOSView::create(array('errors' => $form->getErrors()), Codes::HTTP_INTERNAL_SERVER_ERROR);
    }
    /**
     * Update a GuiaComerciante entity.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
     */
    public function putAction(Request $request, GuiaComerciante $entity)
    {
        try {
            $em = $this->getDoctrine()->getManager();
            $request->setMethod('PATCH'); //Treat all PUTs as PATCH
            $form = $this->createForm(get_class(new GuiaComercianteType()), $entity, array("method" => $request->getMethod()));
            $this->removeExtraFields($request, $form);
            $form->handleRequest($request);
            if ($form->isValid()) {
                $em->flush();

                return $entity;
            }

            return FOSView::create(array('errors' => $form->getErrors()), Codes::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return FOSView::create($e->getMessage(), Codes::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Partial Update to a GuiaComerciante entity.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
     */
    public function patchAction(Request $request, GuiaComerciante $entity)
    {
        return $this->putAction($request, $entity);
    }
    /**
     * Delete a GuiaComerciante entity.
     *
     * @View(statusCode=204)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
     */
    public function deleteAction(Request $request, GuiaComerciante $entity)
    {
        try {
            $em = $this->getDoctrine()->getManager();
            $em->remove($entity);
            $em->flush();

            return null;
        } catch (\Exception $e) {
            return FOSView::create($e->getMessage(), Codes::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get GuiaComerciante entity
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @return Response
     *
     */
    public function comerciantesAction()
    {
        $em = $this->getDoctrine()->getManager();
        $entity = $em->getRepository('AppBundle:GuiaComerciante');

        return $entity->getComerciantes();
    }

    /**
     * User data.
     *
     * @return Object User
     */
    public function getUserData()
    {
        $userManager = $this->container->get('fos_user.user_manager');

        return $userManager->findUserByUsername($this->getUser()->getUserName());
    }
}
