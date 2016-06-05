<?php

namespace AppBundle\Controller;

use AppBundle\Entity\EstuPnf;
use AppBundle\Entity\Estudiante;
use AppBundle\Form\EstudianteType;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\Annotations\RouteResource;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Request\ParamFetcherInterface;
use FOS\RestBundle\Util\Codes;
use FOS\RestBundle\View\View as FOSView;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Voryx\RESTGeneratorBundle\Controller\VoryxController;

/**
 * Reporte controller.
 * @RouteResource("Reporte")
 */
class ReporteRESTController extends VoryxController
{
    /**
     * Obtener reporte guia de traslado.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @Route("/reportes/guia", name="reports_guia")
     *
     * @QueryParam(name="uriReport", nullable=true, description="")
     * @QueryParam(name="id", nullable=true, description="")
     *
     * @return Response
     */
    public function rptGuiaTrasladoAction(ParamFetcherInterface $paramFetcher)
    {
        $id = $paramFetcher->get('id');
        $username = $this->getUser()->getUserName();

        $param = array(
            'action'  => 'rpt',
            'report'  => 'rptGuiaTraslado',
            'format' => 'pdf',
            'param' => array(
                'id' => $id,
                'username' => $username,
            )
        );

        return array(
            'url' => $this->generateUrl('reports_q', $param),
            'parameters' => $param
        );
    }

    /**
     * Obtener reportes
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @Route("/reportes")
     *
     * @QueryParam(name="action", nullable=false, description="Method recipient backend.")
     * @QueryParam(name="report", nullable=false, description="Source name report jasper.")
     * @QueryParam(name="format", nullable=true, default="pdf", description="Format out report.")
     * @QueryParam(name="param", nullable=true, array=true, description="Parameter of report.")
     *
     * @return Response
     */
    public function rptAction(ParamFetcherInterface $paramFetcher)
    {
        $action = $paramFetcher->get('action');
        $report = $paramFetcher->get('report');
        $format = $paramFetcher->get('format');
        $param = !is_null($paramFetcher->get('param')) ? $paramFetcher->get('param') : array();

        if (isset($param['username'])) {
            $param['username'] = $this->getUser()->getUserName();
        }

        $param = array(
            'action'  => $action,
            'report'  => $report,
            'format' => $format,
            'param' => $param
        );

        return array(
            'url' => $this->generateUrl('reports_q', $param),
            'parameters' => $param
        );
    }

    /**
     * Get report comercio.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     * @Route("/reportes/comerciantes")
     *
     * @QueryParam(name="optionDate", nullable=true,  description="Report option date")
     * @QueryParam(name="dataDate", nullable=true, array=true, description="Report by fields. Must be an array. &dataDate[field]=value")
     * @QueryParam(name="optionGral", nullable=true, description="Report option general")
     * @QueryParam(name="dataGral", nullable=true, array=true, description="Report by fields. Must be an array. &dataGral[field]=value")
     * @QueryParam(name="action", nullable=false, description="Method recipient backend.")
     * @QueryParam(name="format", nullable=true, default="pdf", description="Format out report.")
     * @QueryParam(name="report", nullable=true, description="")
     * @QueryParam(name="param", nullable=true, array=true, description="Parameter of report.")
     *
     * @return Response
     */
    public function rptComercianteAction(ParamFetcherInterface $paramFetcher)
    {
        list($dateFrom, $dateTo) = $this->dateQuery($paramFetcher);

        $from = $dateFrom->format('Y-m-d')/*.' 00:00:00'*/;
        $to = $dateTo->format('Y-m-d')/*.' 23:59:59'*/;

        $action = $paramFetcher->get('action');
        $report = $paramFetcher->get('report');
        $format = $paramFetcher->get('format');
        $param = !is_null($paramFetcher->get('param')) ? $paramFetcher->get('param') : array();

        if (isset($param['username'])) {
            $param['username'] = $this->getUser()->getUserName();
        }

        $param['dateFrom'] =  "\"$from\"";
        $param['dateTo'] =  "\"$to\"";

        $param = array(
            'action'  => $action,
            'report'  => $report,
            'format' => $format,
            'param' => $param
        );

        return array(
            'url' => $this->generateUrl('reports_q', $param),
            'parameters' => $param
        );
    }

    /**
     * @QueryParam(name="optionDate", nullable=true,  description="Report option date")
     * @QueryParam(name="dataDate", nullable=true, array=true, description="Report by fields. Must be an array. &dataDate[field]=value")
     * @return array
     */
    public function dateQuery(ParamFetcherInterface $paramFetcher)
    {
        $optionDate = $paramFetcher->get('optionDate');
        $dataDate = !is_null($paramFetcher->get('dataDate')) ? $paramFetcher->get('dataDate') : array();

        $dateFormatCustom = array('day', 'dayBefore', 'week', 'weekBefore', 'month', 'monthBefore', 'all');
        $dateFormatYear = array('January','February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

        $dateFrom = $dateTo = null;

        if ($optionDate === 'between' && $dataDate['dateFrom'] && $dataDate['dateTo']) {
            $dateFrom = new \DateTime($dataDate['dateFrom']);
            $dateTo = new \DateTime($dataDate['dateTo']);
        } elseif ($optionDate === 'del' && in_array($dataDate['dateFormat'], $dateFormatCustom)) {
            $now = new \DateTime('now');
            switch ($dataDate['dateFormat']) {
                case 'day':
                    $dateFrom = $dateTo = new \DateTime();
                    break;
                case 'dayBefore':
                    $dateFrom = $dateTo = new \DateTime('-1 days');
                    break;
                case 'week':
                    if (date('N') == 7) {
                        $dateFrom = new \DateTime('-7 days Monday this week' . $now->format('Y-m-d'));
                        $dateTo = new \DateTime('-7 days Sunday this week' . $now->format('Y-m-d'));
                    } else {
                        $dateFrom = new \DateTime('Monday this week' . $now->format('Y-m-d'));
                        $dateTo = new \DateTime('Sunday this week' . $now->format('Y-m-d'));
                    }
                    break;
                case 'weekBefore':
                    if (date('N') == 7) {
                        $dateFrom = new \DateTime('-7 days Monday last week' . $now->format('Y-m-d'));
                        $dateTo = new \DateTime('-7 days Sunday last week' . $now->format('Y-m-d'));
                    } else {
                        $dateFrom = new \DateTime('Monday last week' . $now->format('Y-m-d'));
                        $dateTo = new \DateTime('Sunday last week' . $now->format('Y-m-d'));
                    }
                    break;
                case 'month':
                    $dateFrom = new \DateTime('first day of this month' . $now->format('Y-m-d'));
                    $dateTo = new \DateTime('last day of this month' . $now->format('Y-m-d'));
                    break;
                case 'monthBefore':
                    $dateFrom = new \DateTime('first day of last month' . $now->format('Y-m-d'));
                    $dateTo = new \DateTime('last day of last month' . $now->format('Y-m-d'));
                    break;

                case 'all':
                    $dateFrom = new \DateTime('2015-01-01');
                    $dateTo = $now;
                    break;
            }
        } elseif ($optionDate === 'del' && in_array($dataDate['dateFormat'], $dateFormatYear)) {
            $now = new \DateTime('now');

            $dateFormat = $dataDate['dateFormat'];
            $year = ($dataDate['year'])?: $now->format('Y');

            $dateFrom = new \DateTime('first day of this month ' . $dateFormat . ' ' . $year);
            $dateTo = new \DateTime('last day of this month '  . $dateFormat . ' ' . $year);
        }

        if (!($dateFrom || $dateTo)) {
            throw new Exception("Failed date value null", 1);
            //FOSView::create("failed date value $dateFrom || $dateTo", Codes::HTTP_INTERNAL_SERVER_ERROR);
        }

        return array($dateFrom, $dateTo);
    }
}
