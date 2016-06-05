<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ProductoRubro
 *
 * @ORM\Table(name="_producto_rubro", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="producto_id", columns={"producto_id"}), @ORM\Index(name="rubro_id", columns={"rubro_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ProductoRubroRepository")
 */
class ProductoRubro
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
     * @var \Xproducto
     *
     * @ORM\ManyToOne(targetEntity="Xproducto")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="producto_id", referencedColumnName="id")
     * })
     */
    private $producto;

    /**
     * @var \Rubro
     *
     * @ORM\ManyToOne(targetEntity="Rubro")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="rubro_id", referencedColumnName="id")
     * })
     */
    private $rubro;

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
     * Set producto
     *
     * @param \AppBundle\Entity\Xproducto $producto
     *
     * @return ProductoRubro
     */
    public function setProducto(\AppBundle\Entity\Xproducto $producto = null)
    {
        $this->producto = $producto;

        return $this;
    }

    /**
     * Get producto
     *
     * @return \AppBundle\Entity\Xproducto
     */
    public function getProducto()
    {
        return $this->producto;
    }

    /**
     * Set rubro
     *
     * @param \AppBundle\Entity\Rubro $rubro
     *
     * @return ProductoRubro
     */
    public function setRubro(\AppBundle\Entity\Rubro $rubro = null)
    {
        $this->rubro = $rubro;

        return $this;
    }

    /**
     * Get rubro
     *
     * @return \AppBundle\Entity\Rubro
     */
    public function getRubro()
    {
        return $this->rubro;
    }
}
