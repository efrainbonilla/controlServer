<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Type;
use JMS\Serializer\Annotation\Accessor;
use JMS\Serializer\Annotation\SerializedName;

/**
 * VehiculoTransporte
 *
 * @ORM\Table(name="_vehiculo_transporte", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="vehiculo_id", columns={"vehiculo_id"}), @ORM\Index(name="persona_id", columns={"persona_id"}), @ORM\Index(name="comerciante_id", columns={"comerciante_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\VehiculoTransporteRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class VehiculoTransporte
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
     * @var \Vehiculo
     *
     * @ORM\ManyToOne(targetEntity="Vehiculo")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="vehiculo_id", referencedColumnName="id")
     * })
     */
    private $vehiculo;

    /**
     * @var \Persona
     *
     * @ORM\ManyToOne(targetEntity="Persona")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="persona_id", referencedColumnName="id")
     * })
     */
    private $conductor;

    /**
     * @var \GuiaComerciante
     *
     * @ORM\ManyToOne(targetEntity="GuiaComerciante")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="comerciante_id", referencedColumnName="id")
     * })
     */
    private $comerciante;

    /**
     * @var \TransporteCliente
     *
     * @ORM\OneToMany(targetEntity="TransporteCliente", mappedBy="transporte", cascade={"persist", "remove"})
     */
    private $cliente;

    /**
     * @var string
     *
     * @SerializedName("codi")
     * @Type("string")
     * @Accessor(getter="getCodigo")
     */
    private $codigo;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->cliente = new ArrayCollection();
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
     * Set vehiculo
     *
     * @param \AppBundle\Entity\Vehiculo $vehiculo
     *
     * @return VehiculoTransporte
     */
    public function setVehiculo(\AppBundle\Entity\Vehiculo $vehiculo = null)
    {
        $this->vehiculo = $vehiculo;

        return $this;
    }

    /**
     * Get vehiculo
     *
     * @return \AppBundle\Entity\Vehiculo
     */
    public function getVehiculo()
    {
        return $this->vehiculo;
    }

    /**
     * Set conductor
     *
     * @param \AppBundle\Entity\Persona $conductor
     *
     * @return VehiculoTransporte
     */
    public function setConductor(\AppBundle\Entity\Persona $conductor = null)
    {
        $this->conductor = $conductor;

        return $this;
    }

    /**
     * Get conductor
     *
     * @return \AppBundle\Entity\Persona
     */
    public function getConductor()
    {
        return $this->conductor;
    }

    /**
     * Set comerciante
     *
     * @param \AppBundle\Entity\GuiaComerciante $comerciante
     *
     * @return VehiculoTransporte
     */
    public function setComerciante(\AppBundle\Entity\GuiaComerciante $comerciante = null)
    {
        $this->comerciante = $comerciante;

        return $this;
    }

    /**
     * Get comerciante
     *
     * @return \AppBundle\Entity\GuiaComerciante
     */
    public function getComerciante()
    {
        return $this->comerciante;
    }

    /**
     * Add cliente
     *
     * @param \AppBundle\Entity\TransporteCliente $cliente
     * @return VehiculoTransporte
     */
    public function addCliente(\AppBundle\Entity\TransporteCliente $cliente)
    {
        $this->cliente[] = $cliente;
        $cliente->setTransporte($this);

        return $this;
    }

    /**
     * Remove cliente
     *
     * @param \AppBundle\Entity\TransporteCliente $cliente
     */
    public function removeCliente(\AppBundle\Entity\TransporteCliente $cliente)
    {
        $this->cliente->removeElement($cliente);
    }

    /**
     * Get cliente
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getCliente()
    {
        return $this->cliente;
    }

    /**
     * Get Codigo.
     *
     * @return string
     */
    public function getCodigo()
    {
        return sprintf("%04s-%04s", $this->getComerciante()->getId(), $this->getId());
    }
}
