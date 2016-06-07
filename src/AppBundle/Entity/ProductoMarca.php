<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\ORM\Mapping as ORM;

/**
 * ProductoMarca
 *
 * @ORM\Table(name="_producto_marca", uniqueConstraints={@ORM\UniqueConstraint(name="uniq_prod_marca", columns={"producto_id", "marcaproducto_id"})}, options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="producto_id", columns={"producto_id"}), @ORM\Index(name="marcaproducto_id", columns={"marcaproducto_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ProductoMarcaRepository")
 */
class ProductoMarca
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
     * @var \MarcaProducto
     *
     * @ORM\ManyToOne(targetEntity="MarcaProducto")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="marcaproducto_id", referencedColumnName="id")
     * })
     */
    private $marca;

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
     * @return ProductoMarca
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
     * Set marca
     *
     * @param \AppBundle\Entity\MarcaProducto $marca
     * @return ProductoMarca
     */
    public function setMarca(\AppBundle\Entity\MarcaProducto $marca = null)
    {
        $this->marca = $marca;

        return $this;
    }

    /**
     * Get marca
     *
     * @return \AppBundle\Entity\MarcaProducto
     */
    public function getMarca()
    {
        return $this->marca;
    }
}
