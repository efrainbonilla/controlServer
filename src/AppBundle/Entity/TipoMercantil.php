<?php

namespace AppBundle\Entity;

use AppBundle\Util\Utility;
use Doctrine\ORM\Mapping as ORM;

/**
 * TipoMercantil
 *
 * @ORM\Table(name="_tipo_mercantil", options={"collate"="utf8_general_ci", "charset"="utf8"})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TipoMercantilRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class TipoMercantil
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
     * @ORM\Column(name="descrip", type="string", length=100, nullable=false)
     */
    private $desc;

    /**
     * @var string
     *
     * @ORM\Column(name="codi", type="string", length=30, nullable=false)
     */
    private $codi;

    /**
     * Hook on pre-persist operations.
     *
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->desc = Utility::upperCase($this->desc);
        $this->codi = Utility::lowerCase($this->codi);
    }

    /**
     * Hook on pre-update operations.
     *
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->desc = Utility::upperCase($this->desc);
        $this->codi = Utility::lowerCase($this->codi);
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
     * Set desc
     *
     * @param  string        $desc
     * @return TipoMercantil
     */
    public function setDesc($desc)
    {
        $this->desc = $desc;

        return $this;
    }

    /**
     * Get desc
     *
     * @return string
     */
    public function getDesc()
    {
        return $this->desc;
    }

    /**
     * Set codi
     *
     * @param  string        $codi
     * @return TipoMercantil
     */
    public function setCodi($codi)
    {
        $this->codi = $codi;

        return $this;
    }

    /**
     * Get codi
     *
     * @return string
     */
    public function getCodi()
    {
        return $this->codi;
    }
}
