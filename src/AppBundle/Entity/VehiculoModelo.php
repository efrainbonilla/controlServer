<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Accessor;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\Type;

/**
 * VehiculoModelo
 *
 * @ORM\Table(name="_vehiculo_modelo", uniqueConstraints={@ORM\UniqueConstraint(name="uniq_marca_modelo_anio", columns={"marca_id", "nomb", "anio"})}, options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="marca_id", columns={"marca_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\VehiculoModeloRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class VehiculoModelo
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
     * @ORM\Column(name="nomb", type="string", length=100, nullable=false)
     */
    private $nomb;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="anio", columnDefinition="YEAR", nullable=true)
     */
    private $anio;

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
     * @var string
     *
     * @SerializedName("modelo_anio")
     * @Type("string")
     * @Accessor(getter="getModeloAnio")
     */
    private $modeloAnio;

    /**
     * Hook on pre-persist operations.
     *
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->nomb = Utility::upperCase($this->nomb);
    }

    /**
     * Hook on pre-update operations.
     *
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->nomb = Utility::upperCase($this->nomb);
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
     * Set nomb
     *
     * @param string $nomb
     *
     * @return VehiculoModelo
     */
    public function setNomb($nomb)
    {
        $this->nomb = $nomb;

        return $this;
    }

    /**
     * Get nomb
     *
     * @return string
     */
    public function getNomb()
    {
        return $this->nomb;
    }

    /**
     * Set anio
     *
     * @param \year $anio
     *
     * @return VehiculoModelo
     */
    public function setAnio($anio)
    {
        $this->anio = $anio;

        return $this;
    }

    /**
     * Get anio
     *
     * @return \year
     */
    public function getAnio()
    {
        return $this->anio;
    }

    /**
     * Set marca
     *
     * @param \AppBundle\Entity\VehiculoMarca $marca
     *
     * @return VehiculoModelo
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
     * Get ModeloAnio.
     *
     * @return string
     */
    public function getModeloAnio()
    {
        return sprintf(
            '%s (%s)',
            $this->getNomb(),
            $this->getAnio()
        );
    }
}
