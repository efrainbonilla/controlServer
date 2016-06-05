<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use AppBundle\Util\Utility;

/**
 * Zona.
 *
 * @ORM\Table(name="zona", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="parroq_codi", columns={"parroq_codi"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ZonaRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Zona
{
    /**
     * @var int
     *
     * @ORM\Column(name="zona_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $zonaId;

    /**
     * @var string
     *
     * @ORM\Column(name="zona_nomb", type="string", length=100, nullable=false)
     */
    private $zonaNomb;

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
     * Hook on pre-persist operations.
     *
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->zonaNomb = Utility::upperCase($this->zonaNomb);
    }

    /**
     * Hook on pre-update operations.
     *
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->zonaNomb = Utility::upperCase($this->zonaNomb);
    }

    /**
     * Set zonaId.
     *
     * @param string $zonaId
     *
     * @return Zona
     */
    public function setZonaId($zonaId)
    {
        $this->zonaId = $zonaId;

        return $this;
    }

    /**
     * Get zonaId.
     *
     * @return int
     */
    public function getZonaId()
    {
        return $this->zonaId;
    }

    /**
     * Set zonaNomb.
     *
     * @param string $zonaNomb
     *
     * @return Zona
     */
    public function setZonaNomb($zonaNomb)
    {
        $this->zonaNomb = $zonaNomb;

        return $this;
    }

    /**
     * Get zonaNomb.
     *
     * @return string
     */
    public function getZonaNomb()
    {
        return $this->zonaNomb;
    }

    /**
     * Set parroq.
     *
     * @param \AppBundle\Entity\Parroquia $parroq
     *
     * @return Zona
     */
    public function setParroq(\AppBundle\Entity\Parroquia $parroq = null)
    {
        $this->parroq = $parroq;

        return $this;
    }

    /**
     * Get parroq.
     *
     * @return \AppBundle\Entity\Parroquia
     */
    public function getParroq()
    {
        return $this->parroq;
    }
}
