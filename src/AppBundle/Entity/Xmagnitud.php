<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\ORM\Mapping as ORM;

/**
 * Xmagnitud
 *
 * @ORM\Table(name="_magnitud", options={"collate"="utf8_general_ci", "charset"="utf8"})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\XmagnitudRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Xmagnitud
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
     * Constructor
     */
    public function __construct()
    {
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
     * @return Xmagnitud
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
     * @return Xmagnitud
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
}
