<?php

namespace AppBundle\Repository;

class ProductoMarcaRepository extends CustomEntityRepository
{
    public function getNbResults()
    {
        return $this->createQueryBuilder('p')
                    ->select('count(p.id)')
                    ->getQuery()
                    ->getSingleScalarResult();
    }
}
