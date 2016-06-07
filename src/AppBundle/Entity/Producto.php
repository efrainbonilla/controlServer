<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Producto
 *
 * @ORM\Table(name="_producto", options={"collate"="utf8_general_ci", "charset"="utf8"})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ProductoRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Producto
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
     * @ORM\Column(name="nomb", type="string", length=100, nullable=false, unique=true)
     */
    private $nomb;

    /**
     * @var \ProductoMarca
     *
     * @ORM\OneToMany(targetEntity="ProductoMarca", mappedBy="producto", cascade={"persist", "remove"})
     */
    private $marca;

    /**
     * @var \ProductoRubro
     *
     * @ORM\OneToMany(targetEntity="ProductoRubro", mappedBy="producto", cascade={"persist", "remove"})
     */
    private $rubro;

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
     * Constructor.
     */
    public function __construct()
    {
        $this->marca = new ArrayCollection();
        $this->rubro = new ArrayCollection();
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
     * @return Producto
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
     * Add marca
     *
     * @param \AppBundle\Entity\ProductoMarca $marca
     *
     * @return Producto
     */
    public function addMarca(\AppBundle\Entity\ProductoMarca $marca)
    {
        $this->marca[] = $marca;
        $marca->setProducto($this);

        return $this;
    }

    /**
     * Remove marca
     *
     * @param \AppBundle\Entity\ProductoMarca $marca
     */
    public function removeMarca(\AppBundle\Entity\ProductoMarca $marca)
    {
        $this->marca->removeElement($marca);
    }

    /**
     * Get marca
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getMarca()
    {
        return $this->marca;
    }

    /**
     * Add rubro
     *
     * @param \AppBundle\Entity\ProductoRubro $rubro
     *
     * @return Producto
     */
    public function addRubro(\AppBundle\Entity\ProductoRubro $rubro)
    {
        $this->rubro[] = $rubro;
        $rubro->setProducto($this);

        return $this;
    }

    /**
     * Remove rubro
     *
     * @param \AppBundle\Entity\ProductoRubro $rubro
     */
    public function removeRubro(\AppBundle\Entity\ProductoRubro $rubro)
    {
        $this->rubro->removeElement($rubro);
    }

    /**
     * Get rubro
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getRubro()
    {
        return $this->rubro;
    }
}
