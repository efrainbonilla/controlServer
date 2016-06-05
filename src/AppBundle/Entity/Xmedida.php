<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\ORM\Mapping as ORM;

/**
 * Xmedida
 *
 * @ORM\Table(name="_medida", uniqueConstraints={@ORM\UniqueConstraint(name="uniq_mag_med", columns={"magnitud_id", "nomb"})}, options={"collate"="utf8_general_ci", "charset"="utf8"})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\XmedidaRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Xmedida
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
     * @var \Xmagnitud
     *
     * @ORM\ManyToOne(targetEntity="Xmagnitud")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="magnitud_id", referencedColumnName="id")
     * })
     */
    private $magnitud;

    /**
     * @var string
     *
     * @ORM\Column(name="nomb", type="string", length=100, nullable=false)
     */
    private $nomb;

    /**
     * @var string
     *
     * @ORM\Column(name="simb", type="string", length=10, nullable=false)
     */
    private $simb;

    /**
     * Hook on pre-persist operations.
     *
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->nomb = Utility::upperCase($this->nomb);
    }

    /**
     * Hook on pre-update operations.
     *
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->nomb = Utility::upperCase($this->nomb);
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
     * Set nomb
     *
     * @param string $nomb
     *
     * @return Xmedida
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
     * Set simb
     *
     * @param string $simb
     *
     * @return Xmedida
     */
    public function setSimb($simb)
    {
        $this->simb = $simb;

        return $this;
    }

    /**
     * Get simb
     *
     * @return string
     */
    public function getSimb()
    {
        return $this->simb;
    }

    /**
     * Set magnitud
     *
     * @param \AppBundle\Entity\Xmagnitud $magnitud
     *
     * @return Xmedida
     */
    public function setMagnitud(\AppBundle\Entity\Xmagnitud $magnitud = null)
    {
        $this->magnitud = $magnitud;

        return $this;
    }

    /**
     * Get magnitud
     *
     * @return \AppBundle\Entity\Xmagnitud
     */
    public function getMagnitud()
    {
        return $this->magnitud;
    }
}
