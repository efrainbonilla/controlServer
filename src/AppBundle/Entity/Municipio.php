<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use AppBundle\Util\Utility;

/**
 * Municipio.
 *
 * @ORM\Table(name="municipio", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="edo_codi", columns={"edo_codi"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\MunicipioRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Municipio
{
    /**
     * @var string
     *
     * @ORM\Column(name="muni_codi", type="string", length=10, nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $muniCodi;

    /**
     * @var string
     *
     * @ORM\Column(name="muni_nomb", type="string", length=100, nullable=false)
     */
    private $muniNomb;

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
     * Hook on pre-persist operations.
     *
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->muniNomb = Utility::upperCase($this->muniNomb);
    }

    /**
     * Hook on pre-update operations.
     *
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->muniNomb = Utility::upperCase($this->muniNomb);
    }

    /**
     * Set muniCodi.
     *
     * @param string $muniCodi
     *
     * @return Municipio
     */
    public function setMuniCodi($muniCodi)
    {
        $this->muniCodi = $muniCodi;

        return $this;
    }

    /**
     * Get muniCodi.
     *
     * @return string
     */
    public function getMuniCodi()
    {
        return $this->muniCodi;
    }

    /**
     * Set muniNomb.
     *
     * @param string $muniNomb
     *
     * @return Municipio
     */
    public function setMuniNomb($muniNomb)
    {
        $this->muniNomb = $muniNomb;

        return $this;
    }

    /**
     * Get muniNomb.
     *
     * @return string
     */
    public function getMuniNomb()
    {
        return $this->muniNomb;
    }

    /**
     * Set edo.
     *
     * @param \AppBundle\Entity\Estado $edo
     *
     * @return Municipio
     */
    public function setEdo(\AppBundle\Entity\Estado $edo = null)
    {
        $this->edo = $edo;

        return $this;
    }

    /**
     * Get edo.
     *
     * @return \AppBundle\Entity\Estado
     */
    public function getEdo()
    {
        return $this->edo;
    }
}
