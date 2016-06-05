<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Accessor;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\Type;

/**
 * Persona
 *
 * @ORM\Table(name="_persona", uniqueConstraints={@ORM\UniqueConstraint(name="uniq_naci_cedu", columns={"naci", "cedu"})}, options={"collate"="utf8_general_ci", "charset"="utf8"})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PersonaRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Persona
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
     * @ORM\Column(name="cedu", type="string", length=15, nullable=false)
     */
    private $cedu;

    /**
     * @var string
     *
     * @ORM\Column(name="naci", type="string", length=1, nullable=false)
     */
    private $naci;

    /**
     * @var string
     *
     * @ORM\Column(name="nomb", type="string", length=100, nullable=false)
     */
    private $nomb;

    /**
     * @var string
     *
     * @ORM\Column(name="apell", type="string", length=100, nullable=false)
     */
    private $apell;

    /**
     * @var \DateTime
     *
     * @Type("DateTime<'Y-m-d'>")
     * @ORM\Column(name="fechnac", type="date", nullable=true)
     */
    private $fechnac;

    /**
     * @var string
     *
     * @ORM\Column(name="telf", type="string", length=11, nullable=true)
     */
    private $telf;

    /**
     * @var string
     *
     * @ORM\Column(name="correo", type="string", length=100, nullable=true)
     */
    private $correo;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="fechcreado", type="datetime", nullable=false)
     */
    private $fechcreado;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="fechmodi", type="datetime", nullable=false)
     */
    private $fechmodi;

    /**
     * @var string
     *
     * @SerializedName("nac_cedu")
     * @Type("string")
     * @Accessor(getter="getNacCedu")
     */
    private $nacCedu;

    /**
     * @var string
     *
     * @SerializedName("nomb_apell")
     * @Type("string")
     * @Accessor(getter="getNombApell")
     */
    private $nombApell;

    /**
     * @var string
     *
     * @SerializedName("cedu_nomb_apell")
     * @Type("string")
     * @Accessor(getter="getCeduNombApell")
     */
    private $ceduNombApell;

    /**
     * @var string
     *
     * @SerializedName("nac_cedu_nomb_apell")
     * @Type("string")
     * @Accessor(getter="getNacCeduNombApell")
     */
    private $nacCeduNombApell;

    /**
     * Hook on pre-persist operations.
     *
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->fechmodi = new \DateTime();
        $this->fechcreado = new \DateTime();
        $this->cedu = Utility::upperCase($this->cedu);
        $this->naci = Utility::upperCase($this->naci);
        $this->nomb = Utility::upperCase($this->nomb);
        $this->apell = Utility::upperCase($this->apell);
        $this->correo = Utility::lowerCase($this->correo);
    }

    /**
     * Hook on pre-update operations.
     *
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->fechmodi = new \DateTime();
        $this->cedu = Utility::upperCase($this->cedu);
        $this->naci = Utility::upperCase($this->naci);
        $this->nomb = Utility::upperCase($this->nomb);
        $this->apell = Utility::upperCase($this->apell);
        $this->correo = Utility::lowerCase($this->correo);
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
     * Set cedu
     *
     * @param string $cedu
     *
     * @return Persona
     */
    public function setCedu($cedu)
    {
        $this->cedu = $cedu;

        return $this;
    }

    /**
     * Get cedu
     *
     * @return string
     */
    public function getCedu()
    {
        return $this->cedu;
    }

    /**
     * Set naci
     *
     * @param string $naci
     *
     * @return Persona
     */
    public function setNaci($naci)
    {
        $this->naci = $naci;

        return $this;
    }

    /**
     * Get naci
     *
     * @return string
     */
    public function getNaci()
    {
        return $this->naci;
    }

    /**
     * Set nomb
     *
     * @param string $nomb
     *
     * @return Persona
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
     * Set apell
     *
     * @param string $apell
     *
     * @return Persona
     */
    public function setApell($apell)
    {
        $this->apell = $apell;

        return $this;
    }

    /**
     * Get apell
     *
     * @return string
     */
    public function getApell()
    {
        return $this->apell;
    }

    /**
     * Set fechnac
     *
     * @param \DateTime $fechnac
     *
     * @return Persona
     */
    public function setFechnac(\DateTime $fechnac = null)
    {
        $this->fechnac = $fechnac;

        return $this;
    }

    /**
     * Get fechnac
     *
     * @return \DateTime
     */
    public function getFechnac()
    {
        return $this->fechnac;
    }

    /**
     * Set telf
     *
     * @param string $telf
     *
     * @return Persona
     */
    public function setTelf($telf)
    {
        $this->telf = $telf;

        return $this;
    }

    /**
     * Get telf
     *
     * @return string
     */
    public function getTelf()
    {
        return $this->telf;
    }

    /**
     * Set correo
     *
     * @param string $correo
     *
     * @return Persona
     */
    public function setCorreo($correo)
    {
        $this->correo = $correo;

        return $this;
    }

    /**
     * Get correo
     *
     * @return string
     */
    public function getCorreo()
    {
        return $this->correo;
    }

    /**
     * Set fechcreado
     *
     * @param \DateTime $fechcreado
     *
     * @return Persona
     */
    public function setFechcreado(\DateTime $fechcreado = null)
    {
        $this->fechcreado = $fechcreado;

        return $this;
    }

    /**
     * Get fechcreado
     *
     * @return \DateTime
     */
    public function getFechcreado()
    {
        return $this->fechcreado;
    }

    /**
     * Set fechmodi
     *
     * @param  \DateTime $fechmodi
     * @return Persona
     */
    public function setFechmodi(\DateTime $fechmodi = null)
    {
        $this->fechmodi = $fechmodi;

        return $this;
    }

    /**
     * Get fechmodi
     *
     * @return \DateTime
     */
    public function getFechmodi()
    {
        return $this->fechmodi;
    }

    /**
     * Get NaciCedu.
     *
     * @return string
     */
    public function getNacCedu()
    {
        return sprintf('%s-%s', $this->getNaci(), $this->getCedu());
    }

    /**
     * Get NombApell.
     *
     * @return string
     */
    public function getNombApell()
    {
        return sprintf('%s %s', $this->getNomb(), $this->getApell());
    }

    /**
     * Get CeduNombApell.
     *
     * @return string
     */
    public function getCeduNombApell()
    {
        return sprintf('%s (%s %s)', $this->getCedu(), $this->getNomb(), $this->getApell());
    }

    /**
     * Get CeduNombApell.
     *
     * @return string
     */
    public function getNacCeduNombApell()
    {
        return sprintf('%s-%s (%s %s)', $this->getNaci(), $this->getCedu(), $this->getNomb(), $this->getApell());
    }
}
