<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Type;
use JMS\Serializer\Annotation\Accessor;
use JMS\Serializer\Annotation\SerializedName;

/**
 * GuiaComerciante
 *
 * @ORM\Table(name="_guia_comerciante", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="user_id", columns={"user_id"}), @ORM\Index(name="mercantil_id", columns={"mercantil_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\GuiaComercianteRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class GuiaComerciante
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var \DateTime
     *
     * @Type("DateTime<'Y-m-d'>")
     * @ORM\Column(name="fechsali", type="date", nullable=false)
     */
    private $fechsali;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="fechmodi", type="datetime", nullable=false)
     */
    private $fechmodi;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="fechcreado", type="datetime", nullable=false)
     */
    private $fechcreado;

    /**
     * @var \User
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="user_id")
     * })
     */
    private $user;

    /**
     * @var \Mercantil
     *
     * @ORM\ManyToOne(targetEntity="Mercantil")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="mercantil_id", referencedColumnName="id")
     * })
     */
    private $mercantil;

    /**
     * @var \VehiculoTransporte
     *
     * @ORM\OneToMany(targetEntity="VehiculoTransporte", mappedBy="comerciante", cascade={"persist", "remove"})
     */
    private $transporte;

    /**
     * @var string
     *
     * @SerializedName("codi")
     * @Type("string")
     * @Accessor(getter="getCodigo")
     */
    private $codigo;

    /**
     * Hook on pre-persist operations.
     *
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->fechmodi = new \DateTime();
        $this->fechcreado = new \DateTime();
    }

    /**
     * Hook on pre-update operations.
     *
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->fechmodi = new \DateTime();
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->transporte = new ArrayCollection();
    }

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
     * Set fechsali
     *
     * @param \DateTime $fechsali
     *
     * @return GuiaComerciante
     */
    public function setFechsali($fechsali)
    {
        $this->fechsali = $fechsali;

        return $this;
    }

    /**
     * Get fechsali
     *
     * @return \DateTime
     */
    public function getFechsali()
    {
        return $this->fechsali;
    }

    /**
     * Set fechmodi
     *
     * @param \DateTime $fechmodi
     *
     * @return GuiaComerciante
     */
    public function setFechmodi($fechmodi)
    {
        $this->fechmodi = $fechmodi;

        return $this;
    }

    /**
     * Get fechmodi
     *
     * @return \DateTime
     */
    public function getFechmodi()
    {
        return $this->fechmodi;
    }

    /**
     * Set fechcreado
     *
     * @param \DateTime $fechcreado
     *
     * @return GuiaComerciante
     */
    public function setFechcreado($fechcreado)
    {
        $this->fechcreado = $fechcreado;

        return $this;
    }

    /**
     * Get fechcreado
     *
     * @return \DateTime
     */
    public function getFechcreado()
    {
        return $this->fechcreado;
    }

    /**
     * Set user
     *
     * @param \AppBundle\Entity\User $user
     *
     * @return GuiaComerciante
     */
    public function setUser(\AppBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \AppBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set mercantil
     *
     * @param \AppBundle\Entity\Mercantil $mercantil
     *
     * @return GuiaComerciante
     */
    public function setMercantil(\AppBundle\Entity\Mercantil $mercantil = null)
    {
        $this->mercantil = $mercantil;

        return $this;
    }

    /**
     * Get mercantil
     *
     * @return \AppBundle\Entity\Mercantil
     */
    public function getMercantil()
    {
        return $this->mercantil;
    }

    /**
     * Add transporte
     *
     * @param \AppBundle\Entity\VehiculoTransporte $transporte
     *
     * @return GuiaComerciante
     */
    public function addTransporte(\AppBundle\Entity\VehiculoTransporte $transporte)
    {
        $this->transporte[] = $transporte;
        $transporte->setComerciante($this);

        return $this;
    }

    /**
     * Remove transporte
     *
     * @param \AppBundle\Entity\VehiculoTransporte $transporte
     */
    public function removeTransporte(\AppBundle\Entity\VehiculoTransporte $transporte)
    {
        $this->transporte->removeElement($transporte);
    }

    /**
     * Get transporte
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getTransporte()
    {
        return $this->transporte;
    }

    /**
     * Get Codigo.
     *
     * @return string
     */
    public function getCodigo()
    {
        return sprintf("%04s", $this->getId());
    }
}
