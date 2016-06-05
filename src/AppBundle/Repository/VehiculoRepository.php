<?php

namespace AppBundle\Repository;

class VehiculoRepository extends CustomEntityRepository
{
    public function getNbResults()
    {
        return $this->createQueryBuilder('p')
                    ->select('count(p.id)')
                    ->getQuery()
                    ->getSingleScalarResult();
    }
}
