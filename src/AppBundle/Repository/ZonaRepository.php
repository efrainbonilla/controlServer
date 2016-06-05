<?php

namespace AppBundle\Repository;

class ZonaRepository extends CustomEntityRepository
{
    public function getNbResults()
    {
        return $this->createQueryBuilder('p')
                    ->select('count(p.zonaId)')
                    ->getQuery()
                    ->getSingleScalarResult();
    }
}
