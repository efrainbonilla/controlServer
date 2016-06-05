<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Accessor;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\Type;

/**
 * Mercantil
 *
 * @ORM\Table(name="_mercantil", uniqueConstraints={@ORM\UniqueConstraint(name="uniq_fix_rif", columns={"rif_fix", "rif"})}, options={"collate"="utf8_general_ci", "charset"="utf8"})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\MercantilRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Mercantil
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
     * @ORM\Column(name="rif_fix", type="string", length=1, nullable=false)
     */
    private $rifFix;

    /**
     * @var string
     *
     * @ORM\Column(name="rif", type="string", length=15, nullable=false)
     */
    private $rif;

    /**
     * @var string
     *
     * @ORM\Column(name="razon_social", type="string", length=100, nullable=false)
     */
    private $razonSocial;

    /**
     * @var \MercantilDireccion
     *
     * @ORM\OneToOne(targetEntity="MercantilDireccion", mappedBy="mercantil", cascade={"persist", "remove"})
     */
    private $direccion;

    /**
     * @var \MercantilPropietario
     *
     * @ORM\OneToMany(targetEntity="MercantilPropietario", mappedBy="mercantil", cascade={"persist", "remove"})
     */
    private $prop;

    /**
     * @var \MercantilRepresentante
     *
     * @ORM\OneToMany(targetEntity="MercantilRepresentante", mappedBy="mercantil", cascade={"persist", "remove"})
     */
    private $repres;

    /**
     * @var \MercantilTipo
     *
     * @ORM\OneToMany(targetEntity="MercantilTipo", mappedBy="mercantil", cascade={"persist", "remove"})
     */
    private $tipo;

    /**
     * @var string
     *
     * @SerializedName("fix_rif")
     * @Type("string")
     * @Accessor(getter="getFixRif")
     */
    private $nacCedu;

    /**
     * Hook on pre-persist operations.
     *
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->rifFix = Utility::upperCase($this->rifFix);
        $this->rif = Utility::upperCase($this->rif);
        $this->razonSocial = Utility::upperCase($this->razonSocial);
    }

    /**
     * Hook on pre-update operations.
     *
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->rifFix = Utility::upperCase($this->rifFix);
        $this->rif = Utility::upperCase($this->rif);
        $this->razonSocial = Utility::upperCase($this->razonSocial);
    }

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->repres = new ArrayCollection();
        $this->prop = new ArrayCollection();
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
     * Set rifFix
     *
     * @param  string    $rifFix
     * @return Mercantil
     */
    public function setRifFix($rifFix)
    {
        $this->rifFix = $rifFix;

        return $this;
    }

    /**
     * Get rifFix
     *
     * @return string
     */
    public function getRifFix()
    {
        return $this->rifFix;
    }

    /**
     * Set rif
     *
     * @param  string    $rif
     * @return Mercantil
     */
    public function setRif($rif)
    {
        $this->rif = $rif;

        return $this;
    }

    /**
     * Get rif
     *
     * @return string
     */
    public function getRif()
    {
        return $this->rif;
    }

    /**
     * Set razonSocial
     *
     * @param  string    $razonSocial
     * @return Mercantil
     */
    public function setRazonSocial($razonSocial)
    {
        $this->razonSocial = $razonSocial;

        return $this;
    }

    /**
     * Get razonSocial
     *
     * @return string
     */
    public function getRazonSocial()
    {
        return $this->razonSocial;
    }

    /**
     * Set direccion
     *
     * @param  \AppBundle\Entity\MercantilDireccion $direccion
     * @return Mercantil
     */
    public function setDireccion(\AppBundle\Entity\MercantilDireccion $direccion = null)
    {
        $this->direccion = $direccion;
        $this->direccion->setMercantil($this);

        return $this;
    }

    /**
     * Get direccion
     *
     * @return \AppBundle\Entity\MercantilDireccion
     */
    public function getDireccion()
    {
        return $this->direccion;
    }

    /**
     * Add prop
     *
     * @param  \AppBundle\Entity\MercantilPropietario $prop
     * @return Mercantil
     */
    public function addProp(\AppBundle\Entity\MercantilPropietario $prop)
    {
        $this->prop[] = $prop;
        $prop->setMercantil($this);

        return $this;
    }

    /**
     * Remove prop
     *
     * @param \AppBundle\Entity\MercantilPropietario $prop
     */
    public function removeProp(\AppBundle\Entity\MercantilPropietario $prop)
    {
        $this->prop->removeElement($prop);
    }

    /**
     * Get prop
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getProp()
    {
        return $this->prop;
    }

    /**
     * Add repres
     *
     * @param  \AppBundle\Entity\MercantilRepresentante $repres
     * @return Mercantil
     */
    public function addRepre(\AppBundle\Entity\MercantilRepresentante $repres)
    {
        $this->repres[] = $repres;
        $repres->setMercantil($this);

        return $this;
    }

    /**
     * Remove repres
     *
     * @param \AppBundle\Entity\MercantilRepresentante $repres
     */
    public function removeRepre(\AppBundle\Entity\MercantilRepresentante $repres)
    {
        $this->repres->removeElement($repres);
    }

    /**
     * Get repres
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getRepres()
    {
        return $this->repres;
    }

    /**
     * Add tipo
     *
     * @param  \AppBundle\Entity\MercantilTipo $tipo
     * @return Mercantil
     */
    public function addTipo(\AppBundle\Entity\MercantilTipo $tipo)
    {
        $this->tipo[] = $tipo;
        $tipo->setMercantil($this);

        return $this;
    }

    /**
     * Remove tipo
     *
     * @param \AppBundle\Entity\MercantilTipo $tipo
     */
    public function removeTipo(\AppBundle\Entity\MercantilTipo $tipo)
    {
        $this->tipo->removeElement($tipo);
    }

    /**
     * Get tipo
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getTipo()
    {
        return $this->tipo;
    }

    /**
     * Get FixRif.
     *
     * @return string
     */
    public function getFixRif()
    {
        return sprintf('%s-%s', $this->getRifFix(), $this->getRif());
    }
}
