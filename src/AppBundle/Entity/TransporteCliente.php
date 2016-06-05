<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * TransporteCliente
 *
 * @ORM\Table(name="_transporte_cliente", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="transporte_id", columns={"transporte_id"}), @ORM\Index(name="mercantil_id", columns={"mercantil_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TransporteClienteRepository")
 */
class TransporteCliente
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
     * @var \VehiculoTransporte
     *
     * @ORM\ManyToOne(targetEntity="VehiculoTransporte")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="transporte_id", referencedColumnName="id")
     * })
     */
    private $transporte;

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
     * @var \ClienteProducto
     *
     * @ORM\OneToMany(targetEntity="ClienteProducto", mappedBy="cliente", cascade={"persist", "remove"})
     */
    private $producto;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->producto = new ArrayCollection();
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
     * Set transporte
     *
     * @param \AppBundle\Entity\VehiculoTransporte $transporte
     *
     * @return TransporteCliente
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
     * Set mercantil
     *
     * @param \AppBundle\Entity\Mercantil $mercantil
     *
     * @return TransporteCliente
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
     * Add producto
     *
     * @param \AppBundle\Entity\ClienteProducto $producto
     * @return TransporteCliente
     */
    public function addProducto(\AppBundle\Entity\ClienteProducto $producto)
    {
        $this->producto[] = $producto;
        $producto->setCliente($this);
        $producto->setTransporte($this->getTransporte());
        return $this;
    }

    /**
     * Remove producto
     *
     * @param \AppBundle\Entity\ClienteProducto $producto
     */
    public function removeProducto(\AppBundle\Entity\ClienteProducto $producto)
    {
        $this->producto->removeElement($producto);
    }

    /**
     * Get producto
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getProducto()
    {
        return $this->producto;
    }
}
