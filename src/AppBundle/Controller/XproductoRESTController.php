<?php

namespace AppBundle\Controller;

use AppBundle\Entity\ProductoMarca;
use AppBundle\Entity\ProductoRubro;
use AppBundle\Entity\Xproducto;
use AppBundle\Form\XproductoType;
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
 * Xproducto controller.
 * @RouteResource("Xproducto")
 */
class XproductoRESTController extends VoryxController
{
    /**
     * Get a Xproducto entity
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @return Response
     *
     */
    public function getAction(Xproducto $entity)
    {
        return $entity;
    }
    /**
     * Get all Xproducto entities.
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
            $entity = $em->getRepository('AppBundle:Xproducto');
            if (!empty($q)) {
                $filters_ = array(
                    'nomb' => '',
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
     * Create a Xproducto entity.
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
        $entity = new Xproducto();
        $form = $this->createForm(get_class(new XproductoType()), $entity, array("method" => $request->getMethod()));
        $this->productoRubroEntity($request, $entity);
        $this->productoMarcaEntity($request, $entity);
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
     * Update a Xproducto entity.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
     */
    public function putAction(Request $request, Xproducto $entity)
    {
        if (!$request->request->get('nomb')) {
            $request->request->set('nomb', $entity->getNomb());
        }

        $this->productoRubroEntity($request, $entity);
        $this->productoMarcaEntity($request, $entity);

        try {
            $em = $this->getDoctrine()->getManager();
            $request->setMethod('PATCH'); //Treat all PUTs as PATCH
            $form = $this->createForm(new XproductoType(), $entity, array("method" => $request->getMethod()));
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

    public function productoRubroEntity(Request $request, Xproducto $entity)
    {
        if (is_array($request->request->get('rubro'))) {
            $rubro = $request->request->get('rubro');
            $em = $this->getDoctrine()->getManager();
            $entityProductoRubro = $em->getRepository('AppBundle:ProductoRubro')->findBy(
                array('producto' => $entity->getId())
            );

            $productoRubroIds = array();
            foreach ($entityProductoRubro as $key => $enti) {
                $rubroId = $enti->getRubro()->getId();
                if (in_array($rubroId, $rubro)) {
                    if (($key = array_search($rubroId, $rubro)) !== false) {
                        unset($rubro[$key]);
                        sort($rubro);
                    }
                } else {
                    $productoRubroIds[] = $enti;
                }
            }

            //delete entity
            foreach ($productoRubroIds as $key => $value) {
                $em->remove($value);
            }

            if ($productoRubroIds) {
                $em->flush();
            }

            //add entity
            foreach ($rubro as $key => $value) {
                $entityRubro = $em->getRepository('AppBundle:Rubro')->find($value);
                if ($entityRubro) {
                    $entityProductoRubro = new ProductoRubro();
                    $entityProductoRubro->setRubro($entityRubro);
                    $entity->addRubro($entityProductoRubro);
                }
            }
        }
    }

    public function productoMarcaEntity(Request $request, Xproducto $entity)
    {
        if (is_array($request->request->get('marca'))) {
            $marca = $request->request->get('marca');
            $em = $this->getDoctrine()->getManager();
            $entityProductoMarca = $em->getRepository('AppBundle:ProductoMarca')->findBy(
                array('producto' => $entity->getId())
            );

            $productoMarcaIds = array();
            foreach ($entityProductoMarca as $key => $enti) {
                $marcaId = $enti->getMarca()->getId();
                if (in_array($marcaId, $marca)) {
                    if (($key = array_search($marcaId, $marca)) !== false) {
                        unset($marca[$key]);
                        sort($marca);
                    }
                } else {
                    $productoMarcaIds[] = $enti;
                }
            }

            //delete entity
            foreach ($productoMarcaIds as $key => $value) {
                $em->remove($value);
            }

            if ($productoMarcaIds) {
                $em->flush();
            }

            //add entity
            foreach ($marca as $key => $value) {
                $entityMarcaProducto = $em->getRepository('AppBundle:MarcaProducto')->find($value);
                if ($entityMarcaProducto) {
                    $entityProductoMarca = new ProductoMarca();
                    $entityProductoMarca->setMarca($entityMarcaProducto);
                    $entity->addMarca($entityProductoMarca);
                }
            }
        }
    }

    /**
     * Partial Update to a Xproducto entity.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
     */
    public function patchAction(Request $request, Xproducto $entity)
    {
        return $this->putAction($request, $entity);
    }
    /**
     * Delete a Xproducto entity.
     *
     * @View(statusCode=204)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
     */
    public function deleteAction(Request $request, Xproducto $entity)
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
}
