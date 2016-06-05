<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\ORM\Mapping as ORM;

/**
 * MercantilDireccion
 *
 * @ORM\Table(name="_mercantil_direccion", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="mercantil_id", columns={"mercantil_id"}), @ORM\Index(name="edo_codi", columns={"edo_codi"}), @ORM\Index(name="muni_codi", columns={"muni_codi"}), @ORM\Index(name="parroq_codi", columns={"parroq_codi"}), @ORM\Index(name="zona_id", columns={"zona_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\MercantilDireccionRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class MercantilDireccion
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
     * @ORM\Column(name="av_calle", type="string", length=100, nullable=false)
     */
    private $avCalle;

    /**
     * @var string
     *
     * @ORM\Column(name="pto_ref", type="string", length=100, nullable=false)
     */
    private $ptoRef;

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
     * @var \Estado
     *
     * @ORM\ManyToOne(targetEntity="Estado")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="edo_codi", referencedColumnName="edo_codi")
     * })
     */
    private $edo;

    /**
     * @var \Municipio
     *
     * @ORM\ManyToOne(targetEntity="Municipio")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="muni_codi", referencedColumnName="muni_codi")
     * })
     */
    private $muni;

    /**
     * @var \Parroquia
     *
     * @ORM\ManyToOne(targetEntity="Parroquia")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="parroq_codi", referencedColumnName="parroq_codi")
     * })
     */
    private $parroq;

    /**
     * @var \Zona
     *
     * @ORM\ManyToOne(targetEntity="Zona")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="zona_id", referencedColumnName="zona_id")
     * })
     */
    private $zona;

    /**
     * Hook on pre-persist operations.
     *
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->avCalle = Utility::upperCase($this->avCalle);
        $this->ptoRef = Utility::upperCase($this->ptoRef);
    }

    /**
     * Hook on pre-update operations.
     *
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->avCalle = Utility::upperCase($this->avCalle);
        $this->ptoRef = Utility::upperCase($this->ptoRef);
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
     * Set avCalle
     *
     * @param  string             $avCalle
     * @return MercantilDireccion
     */
    public function setAvCalle($avCalle)
    {
        $this->avCalle = $avCalle;

        return $this;
    }

    /**
     * Get avCalle
     *
     * @return string
     */
    public function getAvCalle()
    {
        return $this->avCalle;
    }

    /**
     * Set ptoRef
     *
     * @param  string             $ptoRef
     * @return MercantilDireccion
     */
    public function setPtoRef($ptoRef)
    {
        $this->ptoRef = $ptoRef;

        return $this;
    }

    /**
     * Get ptoRef
     *
     * @return string
     */
    public function getPtoRef()
    {
        return $this->ptoRef;
    }

    /**
     * Set mercantil
     *
     * @param  \AppBundle\Entity\Mercantil $mercantil
     * @return MercantilDireccion
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
     * Set edo
     *
     * @param  \AppBundle\Entity\Estado $edo
     * @return MercantilDireccion
     */
    public function setEdo(\AppBundle\Entity\Estado $edo = null)
    {
        $this->edo = $edo;

        return $this;
    }

    /**
     * Get edo
     *
     * @return \AppBundle\Entity\Estado
     */
    public function getEdo()
    {
        return $this->edo;
    }

    /**
     * Set muni
     *
     * @param  \AppBundle\Entity\Municipio $muni
     * @return MercantilDireccion
     */
    public function setMuni(\AppBundle\Entity\Municipio $muni = null)
    {
        $this->muni = $muni;

        return $this;
    }

    /**
     * Get muni
     *
     * @return \AppBundle\Entity\Municipio
     */
    public function getMuni()
    {
        return $this->muni;
    }

    /**
     * Set parroq
     *
     * @param  \AppBundle\Entity\Parroquia $parroq
     * @return MercantilDireccion
     */
    public function setParroq(\AppBundle\Entity\Parroquia $parroq = null)
    {
        $this->parroq = $parroq;

        return $this;
    }

    /**
     * Get parroq
     *
     * @return \AppBundle\Entity\Parroquia
     */
    public function getParroq()
    {
        return $this->parroq;
    }

    /**
     * Set zona
     *
     * @param  \AppBundle\Entity\Zona $zona
     * @return MercantilDireccion
     */
    public function setZona(\AppBundle\Entity\Zona $zona = null)
    {
        $this->zona = $zona;

        return $this;
    }

    /**
     * Get zona
     *
     * @return \AppBundle\Entity\Zona
     */
    public function getZona()
    {
        return $this->zona;
    }
}
