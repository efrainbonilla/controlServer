<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use AppBundle\Util\Utility;

/**
 * Parroquia.
 *
 * @ORM\Table(name="parroquia", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="muni_codi", columns={"muni_codi"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ParroquiaRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Parroquia
{
    /**
     * @var string
     *
     * @ORM\Column(name="parroq_codi", type="string", length=10, nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $parroqCodi;

    /**
     * @var string
     *
     * @ORM\Column(name="parroq_nomb", type="string", length=100, nullable=false)
     */
    private $parroqNomb;

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
     * Hook on pre-persist operations.
     *
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->parroqNomb = Utility::upperCase($this->parroqNomb);
    }

    /**
     * Hook on pre-update operations.
     *
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->parroqNomb = Utility::upperCase($this->parroqNomb);
    }

    /**
     * Set parroqCodi.
     *
     * @param string $parroqCodi
     *
     * @return Parroquia
     */
    public function setParroqCodi($parroqCodi)
    {
        $this->parroqCodi = $parroqCodi;

        return $this;
    }

    /**
     * Get parroqCodi.
     *
     * @return string
     */
    public function getParroqCodi()
    {
        return $this->parroqCodi;
    }

    /**
     * Set parroqNomb.
     *
     * @param string $parroqNomb
     *
     * @return Parroquia
     */
    public function setParroqNomb($parroqNomb)
    {
        $this->parroqNomb = $parroqNomb;

        return $this;
    }

    /**
     * Get parroqNomb.
     *
     * @return string
     */
    public function getParroqNomb()
    {
        return $this->parroqNomb;
    }

    /**
     * Set muni.
     *
     * @param \AppBundle\Entity\Municipio $muni
     *
     * @return Parroquia
     */
    public function setMuni(\AppBundle\Entity\Municipio $muni = null)
    {
        $this->muni = $muni;

        return $this;
    }

    /**
     * Get muni.
     *
     * @return \AppBundle\Entity\Municipio
     */
    public function getMuni()
    {
        return $this->muni;
    }
}
