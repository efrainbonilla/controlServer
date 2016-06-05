<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * AjusteReporte.
 *
 * @ORM\Table(name="ajuste_reporte", options={"collate"="utf8_general_ci", "charset"="utf8"})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\AjusteReporteRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class AjusteReporte
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="rpt_module", type="string", length=100, nullable=false)
     */
    private $module;

    /**
     * @var string
     *
     * @ORM\Column(name="rpt_group", type="string", length=100, nullable=false)
     */
    private $group;

    /**
     * @var string
     *
     * @ORM\Column(name="rpt_api", type="string", length=100, nullable=true)
     */
    private $api;

    /**
     * @var string
     *
     * @ORM\Column(name="rpt_action", type="string", length=50, nullable=false)
     */
    private $action;

    /**
     * @var string
     *
     * @ORM\Column(name="rpt_key", type="string", length=100, nullable=false)
     */
    private $key;

    /**
     * @var string
     *
     * @ORM\Column(name="rpt_value", type="string", length=255, nullable=false)
     */
    private $value;

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set module
     *
     * @param string $module
     * @return AjusteReporte
     */
    public function setModule($module)
    {
        $this->module = $module;

        return $this;
    }

    /**
     * Get module
     *
     * @return string 
     */
    public function getModule()
    {
        return $this->module;
    }

    /**
     * Set group
     *
     * @param string $group
     * @return AjusteReporte
     */
    public function setGroup($group)
    {
        $this->group = $group;

        return $this;
    }

    /**
     * Get group
     *
     * @return string 
     */
    public function getGroup()
    {
        return $this->group;
    }

    /**
     * Set api
     *
     * @param string $api
     * @return AjusteReporte
     */
    public function setApi($api)
    {
        $this->api = $api;

        return $this;
    }

    /**
     * Get api
     *
     * @return string 
     */
    public function getApi()
    {
        return $this->api;
    }

    /**
     * Set action
     *
     * @param string $action
     * @return AjusteReporte
     */
    public function setAction($action)
    {
        $this->action = $action;

        return $this;
    }

    /**
     * Get action
     *
     * @return string 
     */
    public function getAction()
    {
        return $this->action;
    }

    /**
     * Set key
     *
     * @param string $key
     * @return AjusteReporte
     */
    public function setKey($key)
    {
        $this->key = $key;

        return $this;
    }

    /**
     * Get key
     *
     * @return string 
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * Set value
     *
     * @param string $value
     * @return AjusteReporte
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * Get value
     *
     * @return string 
     */
    public function getValue()
    {
        return $this->value;
    }
}
