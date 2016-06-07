<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ClienteProductoType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('presUni')
            ->add('presNum')
            ->add('presCant')
            ->add('compra')
            ->add('venta')
            ->add('producto', 'entity', array(
                'class' => 'AppBundle:Producto',
                'property' => 'id',
            ))
            ->add('prodmarca', 'entity', array(
                'class' => 'AppBundle:ProductoMarca',
                'property' => 'id',
            ))
            ->add('medida')
            ->add('mmedida', 'entity', array(
                'class' => 'AppBundle:Medida',
                'property' => 'id',
            ))
            ->add('cliente', 'entity', array(
                'class' => 'AppBundle:TransporteCliente',
                'property' => 'id',
            ))
            ->add('transporte', 'entity', array(
                'class' => 'AppBundle:VehiculoTransporte',
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
            'data_class' => 'AppBundle\Entity\ClienteProducto'
        ));
    }
}
