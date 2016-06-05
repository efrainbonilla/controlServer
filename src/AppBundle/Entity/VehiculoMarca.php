<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\ORM\Mapping as ORM;

/**
 * VehiculoMarca
 *
 * @ORM\Table(name="_vehiculo_marca", options={"collate"="utf8_general_ci", "charset"="utf8"})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\VehiculoMarcaRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class VehiculoMarca
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
     * @var integer
     *
     * @ORM\Column(name="nomb", type="string", length=100, unique=true)
     */
    private $nomb;

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
     * @param integer $nomb
     *
     * @return VehiculoMarca
     */
    public function setNomb($nomb)
    {
        $this->nomb = $nomb;

        return $this;
    }

    /**
     * Get nomb
     *
     * @return integer
     */
    public function getNomb()
    {
        return $this->nomb;
    }
}
