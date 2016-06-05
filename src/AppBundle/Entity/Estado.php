<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use AppBundle\Util\Utility;

/**
 * Estado.
 *
 * @ORM\Table(name="estado", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="pais_id", columns={"pais_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\EstadoRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Estado
{
    /**
     * @var string
     *
     * @ORM\Column(name="edo_codi", type="string", length=10, nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $edoCodi;

    /**
     * @var string
     *
     * @ORM\Column(name="edo_nomb", type="string", length=100, nullable=false)
     */
    private $edoNomb;

    /**
     * @var \Pais
     *
     * @ORM\ManyToOne(targetEntity="Pais" , cascade={"persist"})
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="pais_id", referencedColumnName="pais_id", nullable=false)
     * })
     */
    private $pais;

    /**
     * Hook on pre-persist operations.
     *
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        $this->edoNomb = Utility::upperCase($this->edoNomb);
    }

    /**
     * Hook on pre-update operations.
     *
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->edoNomb = Utility::upperCase($this->edoNomb);
    }
    /**
     * Set edoCodi.
     *
     * @param string $edoCodi
     *
     * @return Estado
     */
    public function setEdoCodi($edoCodi)
    {
        $this->edoCodi = $edoCodi;

        return $this;
    }

    /**
     * Get edoCodi.
     *
     * @return string
     */
    public function getEdoCodi()
    {
        return $this->edoCodi;
    }

    /**
     * Set edoNomb.
     *
     * @param string $edoNomb
     *
     * @return Estado
     */
    public function setEdoNomb($edoNomb)
    {
        $this->edoNomb = $edoNomb;

        return $this;
    }

    /**
     * Get edoNomb.
     *
     * @return string
     */
    public function getEdoNomb()
    {
        return $this->edoNomb;
    }

    /**
     * Set pais.
     *
     * @param \AppBundle\Entity\Pais $pais
     *
     * @return Estado
     */
    public function setPais(\AppBundle\Entity\Pais $pais = null)
    {
        $this->pais = $pais;

        return $this;
    }

    /**
     * Get pais.
     *
     * @return \AppBundle\Entity\Pais
     */
    public function getPais()
    {
        return $this->pais;
    }
}
