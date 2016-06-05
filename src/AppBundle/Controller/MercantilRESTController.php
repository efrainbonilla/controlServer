<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Mercantil;
use AppBundle\Entity\MercantilPropietario;
use AppBundle\Entity\MercantilRepresentante;
use AppBundle\Entity\MercantilTipo;
use AppBundle\Form\MercantilType;
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
 * Mercantil controller.
 * @RouteResource("Mercantil")
 */
class MercantilRESTController extends VoryxController
{
    /**
     * Get a Mercantil entity
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @return Response
     *
     */
    public function getAction(Mercantil $entity)
    {
        return $entity;
    }
    /**
     * Get all Mercantil entities.
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
            $entity = $em->getRepository('AppBundle:Mercantil');
            if (!empty($q)) {
                $filters_ = array(
                    'rif' => '',
                    'razonSocial' => '',
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
     * Create a Mercantil entity.
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
        $entity = new Mercantil();
        $form = $this->createForm(new MercantilType(), $entity, array("method" => $request->getMethod()));
        $this->mercantilPropEntity($request, $entity);
        $this->mercantilRepresEntity($request, $entity);
        $this->mercantilTipoEntity($request, $entity);
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

    public function mercantilPropEntity(Request $request, Mercantil $entity)
    {
        if (is_array($request->request->get('prop'))) {
            $prop = $request->request->get('prop');
            $em = $this->getDoctrine()->getManager();
            $entityMercantilPropietario = $em->getRepository('AppBundle:MercantilPropietario')->findBy(
                array('mercantil' => $entity->getId())
            );

            $mercantilPropietarioIds = array();
            foreach ($entityMercantilPropietario as $key => $enti) {
                $personaId = $enti->getPersona()->getId();
                if (in_array($personaId, $prop)) {
                    if (($key = array_search($personaId, $prop)) !== false) {
                        unset($prop[$key]);
                        sort($prop);
                    }
                } else {
                    $mercantilPropietarioIds[] = $enti;
                }
            }

            //delete entity
            foreach ($mercantilPropietarioIds as $key => $value) {
                $em->remove($value);
            }

            if ($mercantilPropietarioIds) {
                $em->flush();
            }

            //add entity
            foreach ($prop as $key => $value) {
                $entityPersona = $em->getRepository('AppBundle:Persona')->find($value);
                if ($entityPersona) {
                    $entityMercantilPropietario = new MercantilPropietario();
                    $entityMercantilPropietario->setPersona($entityPersona);
                    $entity->addProp($entityMercantilPropietario);
                }
            }
        }
    }

    public function mercantilRepresEntity(Request $request, Mercantil $entity)
    {
        if (is_array($request->request->get('repres'))) {
            $repres = $request->request->get('repres');
            $em = $this->getDoctrine()->getManager();
            $entityMercantilRepresentante = $em->getRepository('AppBundle:MercantilRepresentante')->findBy(
                array('mercantil' => $entity->getId())
            );

            $mercantilRepresentanteIds = array();
            foreach ($entityMercantilRepresentante as $key => $enti) {
                $personaId = $enti->getPersona()->getId();
                if (in_array($personaId, $repres)) {
                    if (($key = array_search($personaId, $repres)) !== false) {
                        unset($repres[$key]);
                        sort($repres);
                    }
                } else {
                    $mercantilRepresentanteIds[] = $enti;
                }
            }

            //delete entity
            foreach ($mercantilRepresentanteIds as $key => $value) {
                $em->remove($value);
            }

            if ($mercantilRepresentanteIds) {
                $em->flush();
            }

            //add entity
            foreach ($repres as $key => $value) {
                $entityPersona = $em->getRepository('AppBundle:Persona')->find($value);
                if ($entityPersona) {
                    $entityMercantilRepresentante = new MercantilRepresentante();
                    $entityMercantilRepresentante->setPersona($entityPersona);
                    $entity->addRepre($entityMercantilRepresentante);
                }
            }
        }
    }

    public function mercantilTipoEntity(Request $request, Mercantil $entity)
    {
        if (is_array($request->request->get('tipo'))) {
            $tipo = $request->request->get('tipo');
            $em = $this->getDoctrine()->getManager();
            $entityMercantilTipo = $em->getRepository('AppBundle:MercantilTipo')->findBy(
                array('mercantil' => $entity->getId())
            );

            $mercantilTipoIds = array();
            foreach ($entityMercantilTipo as $key => $enti) {
                $tipoId = $enti->getTipo()->getId();
                if (in_array($tipoId, $tipo)) {
                    if (($key = array_search($tipoId, $tipo)) !== false) {
                        unset($tipo[$key]);
                        sort($tipo);
                    }
                } else {
                    $mercantilTipoIds[] = $enti;
                }
            }

            //delete entity
            foreach ($mercantilTipoIds as $key => $value) {
                $em->remove($value);
            }

            if ($mercantilTipoIds) {
                $em->flush();
            }

            //add entity
            foreach ($tipo as $key => $value) {
                $entityTipoMercantil = $em->getRepository('AppBundle:TipoMercantil')->find($value);
                if ($entityTipoMercantil) {
                    $entityMercantilTipo = new MercantilTipo();
                    $entityMercantilTipo->setTipo($entityTipoMercantil);
                    $entity->addTipo($entityMercantilTipo);
                }
            }
        }
    }

    /**
     * Update a Mercantil entity.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
     */
    public function putAction(Request $request, Mercantil $entity)
    {
        $this->mercantilPropEntity($request, $entity);
        $this->mercantilRepresEntity($request, $entity);
        $this->mercantilTipoEntity($request, $entity);
        try {
            $em = $this->getDoctrine()->getManager();
            $request->setMethod('PATCH'); //Treat all PUTs as PATCH
            $form = $this->createForm(new MercantilType(), $entity, array("method" => $request->getMethod()));
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
     * Partial Update to a Mercantil entity.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
*/
    public function patchAction(Request $request, Mercantil $entity)
    {
        return $this->putAction($request, $entity);
    }
    /**
     * Delete a Mercantil entity.
     *
     * @View(statusCode=204)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
     */
    public function deleteAction(Request $request, Mercantil $entity)
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
     * Get all TipoMercantil entities.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @return Response
     *
     * @QueryParam(name="codi", nullable=true, description="codi tipo mercantil")
     */
    public function tipoAction(ParamFetcherInterface $paramFetcher, Request $request)
    {
        $codi = $paramFetcher->get('codi');

        $em = $this->getDoctrine()->getManager();
        $entity = $em->getRepository('AppBundle:Mercantil');

        $results = $entity->getTipoMercantil(array('codi' => $codi));

        return $results;
    }
}
