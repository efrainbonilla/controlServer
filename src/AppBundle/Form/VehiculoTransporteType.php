<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class VehiculoTransporteType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('vehiculo', 'entity', array(
                'class' => 'AppBundle:Vehiculo',
                'property' => 'id',
            ))
            ->add('conductor', 'entity', array(
                'class' => 'AppBundle:Persona',
                'property' => 'id',
            ))
            ->add('comerciante', 'entity', array(
                'class' => 'AppBundle:GuiaComerciante',
                'property' => 'id',
            ))
        ;
    }

    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'csrf_protection' => false,
            'data_class' => 'AppBundle\Entity\VehiculoTransporte'
        ));
    }
}
