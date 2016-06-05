<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * MercantilTipo
 *
 * @ORM\Table(name="_mercantil_tipo", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="mercantil_id", columns={"mercantil_id"}), @ORM\Index(name="tipo_id", columns={"tipo_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\MercantilTipoRepository")
 */
class MercantilTipo
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
     * @var \TipoMercantil
     *
     * @ORM\ManyToOne(targetEntity="TipoMercantil")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="tipo_id", referencedColumnName="id")
     * })
     */
    private $tipo;

    /**
     * @var \Mercantil
     *
     * @ORM\ManyToOne(targetEntity="Mercantil")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="mercantil_id", referencedColumnName="id")
     * })
     */
    private $mercantil;

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
     * Set tipo
     *
     * @param  \AppBundle\Entity\TipoMercantil $tipo
     * @return MercantilTipo
     */
    public function setTipo(\AppBundle\Entity\TipoMercantil $tipo = null)
    {
        $this->tipo = $tipo;

        return $this;
    }

    /**
     * Get tipo
     *
     * @return \AppBundle\Entity\TipoMercantil
     */
    public function getTipo()
    {
        return $this->tipo;
    }

    /**
     * Set mercantil
     *
     * @param  \AppBundle\Entity\Mercantil $mercantil
     * @return MercantilTipo
     */
    public function setMercantil(\AppBundle\Entity\Mercantil $mercantil = null)
    {
        $this->mercantil = $mercantil;

        return $this;
    }

    /**
     * Get mercantil
     *
     * @return \AppBundle\Entity\Mercantil
     */
    public function getMercantil()
    {
        return $this->mercantil;
    }
}
