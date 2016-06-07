<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductoRubroType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('producto', 'entity', array(
                'class' => 'AppBundle:Producto',
                'property' => 'id',
            ))
            ->add('rubro', 'entity', array(
                'class' => 'AppBundle:RubroProducto',
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
            'data_class' => 'AppBundle\Entity\ProductoRubro'
        ));
    }
}
