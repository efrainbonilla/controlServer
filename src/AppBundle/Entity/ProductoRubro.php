<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ProductoRubro
 *
 * @ORM\Table(name="_producto_rubro", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="producto_id", columns={"producto_id"}), @ORM\Index(name="rubroproducto_id", columns={"rubroproducto_id"})})
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
     * @var \Producto
     *
     * @ORM\ManyToOne(targetEntity="Producto")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="producto_id", referencedColumnName="id")
     * })
     */
    private $producto;

    /**
     * @var \RubroProducto
     *
     * @ORM\ManyToOne(targetEntity="RubroProducto")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="rubroproducto_id", referencedColumnName="id")
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
     * @param \AppBundle\Entity\Producto $producto
     *
     * @return ProductoRubro
     */
    public function setProducto(\AppBundle\Entity\Producto $producto = null)
    {
        $this->producto = $producto;

        return $this;
    }

    /**
     * Get producto
     *
     * @return \AppBundle\Entity\Producto
     */
    public function getProducto()
    {
        return $this->producto;
    }

    /**
     * Set rubro
     *
     * @param \AppBundle\Entity\RubroProducto $rubro
     *
     * @return ProductoRubro
     */
    public function setRubro(\AppBundle\Entity\RubroProducto $rubro = null)
    {
        $this->rubro = $rubro;

        return $this;
    }

    /**
     * Get rubro
     *
     * @return \AppBundle\Entity\RubroProducto
     */
    public function getRubro()
    {
        return $this->rubro;
    }
}
