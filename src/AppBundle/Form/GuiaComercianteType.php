<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class GuiaComercianteType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            /*->add('fechsali', 'date')
            ->add('fechmodi', 'datetime')
            ->add('fechcreado', 'datetime')*/
            /*->add('user', 'entity', array(
                'class' => 'AppBundle:User',
                'property' => 'id',
            ))*/
            ->add('mercantil', 'entity', array(
                'class' => 'AppBundle:Mercantil',
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
            'data_class' => 'AppBundle\Entity\GuiaComerciante'
        ));
    }
}
