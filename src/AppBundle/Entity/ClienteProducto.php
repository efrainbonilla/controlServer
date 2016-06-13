<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ClienteProducto
 *
 * @ORM\Table(name="_cliente_producto", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="cliente_id", columns={"cliente_id"}), @ORM\Index(name="transporte_id", columns={"transporte_id"}), @ORM\Index(name="producto_id", columns={"producto_id"}), @ORM\Index(name="prodmarca_id", columns={"prodmarca_id"}), @ORM\Index(name="medida_id", columns={"medida_id"}), @ORM\Index(name="mmedida_id", columns={"mmedida_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ClienteProductoRepository")
 */
class ClienteProducto
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
     * @ORM\Column(name="pres_uni", type="integer", nullable=false)
     */
    private $presUni;

    /**
     * @var float
     *
     * @ORM\Column(name="pres_num", type="float", precision=10, scale=0, nullable=false)
     */
    private $presNum;

    /**
     * @var integer
     *
     * @ORM\Column(name="pres_cant", type="integer", nullable=false)
     */
    private $presCant;

    /**
     * @var float
     *
     * @ORM\Column(name="compra", type="float", precision=10, scale=0, nullable=true)
     */
    private $compra;

    /**
     * @var float
     *
     * @ORM\Column(name="venta", type="float", precision=10, scale=0, nullable=false)
     */
    private $venta;

    /**
     * @var string
     *
     * @ORM\Column(name="obs", type="string", length=100, nullable=true)
     */
    private $obs;

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
     * @var \ProductoMarca
     *
     * @ORM\ManyToOne(targetEntity="ProductoMarca")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="prodmarca_id", referencedColumnName="id")
     * })
     */
    private $prodmarca;

    /**
     * @var \Medida
     *
     * @ORM\ManyToOne(targetEntity="Medida")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="medida_id", referencedColumnName="id")
     * })
     */
    private $medida;

    /**
     * @var \Medida
     *
     * @ORM\ManyToOne(targetEntity="Medida")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="mmedida_id", referencedColumnName="id")
     * })
     */
    private $mmedida;

    /**
     * @var \TransporteCliente
     *
     * @ORM\ManyToOne(targetEntity="TransporteCliente")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="cliente_id", referencedColumnName="id")
     * })
     */
    private $cliente;

    /**
     * @var \VehiculoTransporte
     *
     * @ORM\ManyToOne(targetEntity="VehiculoTransporte")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="transporte_id", referencedColumnName="id")
     * })
     */
    private $transporte;

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
     * Set presUni
     *
     * @param integer $presUni
     *
     * @return ClienteProducto
     */
    public function setPresUni($presUni)
    {
        $this->presUni = $presUni;

        return $this;
    }

    /**
     * Get presUni
     *
     * @return integer
     */
    public function getPresUni()
    {
        return $this->presUni;
    }

    /**
     * Set presNum
     *
     * @param float $presNum
     *
     * @return ClienteProducto
     */
    public function setPresNum($presNum)
    {
        $this->presNum = $presNum;

        return $this;
    }

    /**
     * Get presNum
     *
     * @return float
     */
    public function getPresNum()
    {
        return $this->presNum;
    }

    /**
     * Set presCant
     *
     * @param integer $presCant
     *
     * @return ClienteProducto
     */
    public function setPresCant($presCant)
    {
        $this->presCant = $presCant;

        return $this;
    }

    /**
     * Get presCant
     *
     * @return integer
     */
    public function getPresCant()
    {
        return $this->presCant;
    }

    /**
     * Set compra
     *
     * @param float $compra
     *
     * @return ClienteProducto
     */
    public function setCompra($compra)
    {
        $this->compra = $compra;

        return $this;
    }

    /**
     * Get compra
     *
     * @return float
     */
    public function getCompra()
    {
        return $this->compra;
    }

    /**
     * Set venta
     *
     * @param float $venta
     *
     * @return ClienteProducto
     */
    public function setVenta($venta)
    {
        $this->venta = $venta;

        return $this;
    }

    /**
     * Get venta
     *
     * @return float
     */
    public function getVenta()
    {
        return $this->venta;
    }

    /**
     * Set producto
     *
     * @param \AppBundle\Entity\Producto $producto
     *
     * @return ClienteProducto
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
     * Set prodmarca
     *
     * @param \AppBundle\Entity\ProductoMarca $prodmarca
     *
     * @return ClienteProducto
     */
    public function setProdmarca(\AppBundle\Entity\ProductoMarca $prodmarca = null)
    {
        $this->prodmarca = $prodmarca;

        return $this;
    }

    /**
     * Get prodmarca
     *
     * @return \AppBundle\Entity\ProductoMarca
     */
    public function getProdmarca()
    {
        return $this->prodmarca;
    }

    /**
     * Set medida
     *
     * @param \AppBundle\Entity\Medida $medida
     *
     * @return ClienteProducto
     */
    public function setMedida(\AppBundle\Entity\Medida $medida = null)
    {
        $this->medida = $medida;

        return $this;
    }

    /**
     * Get medida
     *
     * @return \AppBundle\Entity\Medida
     */
    public function getMedida()
    {
        return $this->medida;
    }

    /**
     * Set mmedida
     *
     * @param \AppBundle\Entity\Medida $mmedida
     *
     * @return ClienteProducto
     */
    public function setMmedida(\AppBundle\Entity\Medida $mmedida = null)
    {
        $this->mmedida = $mmedida;

        return $this;
    }

    /**
     * Get mmedida
     *
     * @return \AppBundle\Entity\Medida
     */
    public function getMmedida()
    {
        return $this->mmedida;
    }

    /**
     * Set cliente
     *
     * @param \AppBundle\Entity\TransporteCliente $cliente
     *
     * @return ClienteProducto
     */
    public function setCliente(\AppBundle\Entity\TransporteCliente $cliente = null)
    {
        $this->cliente = $cliente;

        return $this;
    }

    /**
     * Get cliente
     *
     * @return \AppBundle\Entity\TransporteCliente
     */
    public function getCliente()
    {
        return $this->cliente;
    }

    /**
     * Set transporte
     *
     * @param \AppBundle\Entity\VehiculoTransporte $transporte
     *
     * @return ClienteProducto
     */
    public function setTransporte(\AppBundle\Entity\VehiculoTransporte $transporte = null)
    {
        $this->transporte = $transporte;

        return $this;
    }

    /**
     * Get transporte
     *
     * @return \AppBundle\Entity\VehiculoTransporte
     */
    public function getTransporte()
    {
        return $this->transporte;
    }

    /**
     * Set obs
     *
     * @param string $obs
     * @return ClienteProducto
     */
    public function setObs($obs)
    {
        $this->obs = $obs;

        return $this;
    }

    /**
     * Get obs
     *
     * @return string 
     */
    public function getObs()
    {
        return $this->obs;
    }
}
