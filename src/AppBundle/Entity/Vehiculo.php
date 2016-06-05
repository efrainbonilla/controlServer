<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Accessor;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\Type;

/**
 * Vehiculo
 *
 * @ORM\Table(name="_vehiculo", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="marca_id", columns={"marca_id"}), @ORM\Index(name="modelo_id", columns={"modelo_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\VehiculoRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Vehiculo
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
     * @var string
     *
     * @ORM\Column(name="color", type="string", length=50, nullable=false)
     */
    private $color;

    /**
     * @var string
     *
     * @ORM\Column(name="placa", type="string", length=50, nullable=false, unique=true)
     */
    private $placa;

    /**
     * @var \VehiculoMarca
     *
     * @ORM\ManyToOne(targetEntity="VehiculoMarca")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="marca_id", referencedColumnName="id")
     * })
     */
    private $marca;

    /**
     * @var \VehiculoModelo
     *
     * @ORM\ManyToOne(targetEntity="VehiculoModelo")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="modelo_id", referencedColumnName="id")
     * })
     */
    private $modelo;

    /**
     * @var string
     *
     * @SerializedName("placa_marca_modelo_anio_color")
     * @Type("string")
     * @Accessor(getter="getPlacaMarcaModeloColorAnio")
     */
    private $placaMarcaModeloAnioColor;

    /**
     * Hook on pre-persist operations.
     *
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->color = Utility::upperCase($this->color);
        $this->placa = Utility::upperCase($this->placa);
    }

    /**
     * Hook on pre-update operations.
     *
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->color = Utility::upperCase($this->color);
        $this->placa = Utility::upperCase($this->placa);
    }

    /**
     * Constructor
     */
    public function __construct()
    {
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
     * Set color
     *
     * @param string $color
     *
     * @return Vehiculo
     */
    public function setColor($color)
    {
        $this->color = $color;

        return $this;
    }

    /**
     * Get color
     *
     * @return string
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * Set placa
     *
     * @param string $placa
     *
     * @return Vehiculo
     */
    public function setPlaca($placa)
    {
        $this->placa = $placa;

        return $this;
    }

    /**
     * Get placa
     *
     * @return string
     */
    public function getPlaca()
    {
        return $this->placa;
    }

    /**
     * Set marca
     *
     * @param \AppBundle\Entity\VehiculoMarca $marca
     *
     * @return Vehiculo
     */
    public function setMarca(\AppBundle\Entity\VehiculoMarca $marca = null)
    {
        $this->marca = $marca;

        return $this;
    }

    /**
     * Get marca
     *
     * @return \AppBundle\Entity\VehiculoMarca
     */
    public function getMarca()
    {
        return $this->marca;
    }

    /**
     * Set modelo
     *
     * @param \AppBundle\Entity\VehiculoModelo $modelo
     *
     * @return Vehiculo
     */
    public function setModelo(\AppBundle\Entity\VehiculoModelo $modelo = null)
    {
        $this->modelo = $modelo;

        return $this;
    }

    /**
     * Get modelo
     *
     * @return \AppBundle\Entity\VehiculoModelo
     */
    public function getModelo()
    {
        return $this->modelo;
    }

    /**
     * Get PlacaMarcaModeloColorAnio.
     *
     * @return string
     */
    public function getPlacaMarcaModeloColorAnio()
    {
        return sprintf(
            '%s (%s %s(%s) %s)',
            $this->getPlaca(),
            $this->getMarca()->getNomb(),
            $this->getModelo()->getNomb(),
            $this->getModelo()->getAnio(),
            $this->getColor()
        );
    }
}
