<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use AppBundle\Util\Utility;

/**
 * Pais.
 *
 * @ORM\Table(name="pais", options={"collate"="utf8_general_ci", "charset"="utf8"})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PaisRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Pais
{
    /**
     * @var int
     *
     * @ORM\Column(name="pais_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $paisId;

    /**
     * @var string
     *
     * @ORM\Column(name="pais_nomb", type="string", length=100, nullable=false)
     */
    private $paisNomb;

    /**
     * Hook on pre-persist operations.
     *
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->paisNomb = Utility::upperCase($this->paisNomb);
    }

    /**
     * Hook on pre-update operations.
     *
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->paisNomb = Utility::upperCase($this->paisNomb);
    }

    /**
     * Get paisId.
     *
     * @return int
     */
    public function getPaisId()
    {
        return $this->paisId;
    }

    /**
     * Set paisId.
     *
     * @param string $paisId
     *
     * @return Pais
     */
    public function setPaisId($paisId)
    {
        $this->paisId = $paisId;

        return $this;
    }

    /**
     * Set paisNomb.
     *
     * @param string $paisNomb
     *
     * @return Pais
     */
    public function setPaisNomb($paisNomb)
    {
        $this->paisNomb = $paisNomb;

        return $this;
    }

    /**
     * Get paisNomb.
     *
     * @return string
     */
    public function getPaisNomb()
    {
        return $this->paisNomb;
    }
}
