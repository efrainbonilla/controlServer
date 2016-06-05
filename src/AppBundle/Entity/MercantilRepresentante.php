<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * MercantilRepresentante
 *
 * @ORM\Table(name="_mercantil_representante", options={"collate"="utf8_general_ci", "charset"="utf8"}, indexes={@ORM\Index(name="mercantil_id", columns={"mercantil_id"}), @ORM\Index(name="persona_id", columns={"persona_id"})})
 * @ORM\Entity(repositoryClass="AppBundle\Repository\MercantilRepresentanteRepository")
 */
class MercantilRepresentante
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
     * @var \Persona
     *
     * @ORM\ManyToOne(targetEntity="Persona")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="persona_id", referencedColumnName="id")
     * })
     */
    private $persona;

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
     * Set persona
     *
     * @param  \AppBundle\Entity\Persona $persona
     * @return MercantilRepresentante
     */
    public function setPersona(\AppBundle\Entity\Persona $persona = null)
    {
        $this->persona = $persona;

        return $this;
    }

    /**
     * Get persona
     *
     * @return \AppBundle\Entity\Persona
     */
    public function getPersona()
    {
        return $this->persona;
    }

    /**
     * Set mercantil
     *
     * @param  \AppBundle\Entity\Mercantil $mercantil
     * @return MercantilRepresentante
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
