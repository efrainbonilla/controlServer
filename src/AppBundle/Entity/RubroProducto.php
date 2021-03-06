<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\ORM\Mapping as ORM;

/**
 * RubroProducto
 *
 * @ORM\Table(name="_rubro", options={"collate"="utf8_general_ci", "charset"="utf8"})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\RubroProductoRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class RubroProducto
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
     * @ORM\Column(name="nomb", type="string", length=100, nullable=false, unique=true)
     */
    private $nomb;

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
     * @param integer $nomb
     *
     * @return RubroProducto
     */
    public function setNomb($nomb)
    {
        $this->nomb = $nomb;

        return $this;
    }

    /**
     * Get nomb
     *
     * @return integer
     */
    public function getNomb()
    {
        return $this->nomb;
    }
}
