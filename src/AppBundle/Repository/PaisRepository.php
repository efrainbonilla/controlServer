<?php

namespace AppBundle\Repository;

class PaisRepository extends CustomEntityRepository
{
    public function getNbResults()
    {
        return $this->createQueryBuilder('p')
                    ->select('count(p.paisId)')
                    ->getQuery()
                    ->getSingleScalarResult();
    }
}
