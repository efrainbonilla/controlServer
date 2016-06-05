<?php

namespace AppBundle\Repository;

class MunicipioRepository extends CustomEntityRepository
{
    public function getNbResults()
    {
        return $this->createQueryBuilder('p')
                    ->select('count(p.muniCodi)')
                    ->getQuery()
                    ->getSingleScalarResult();
    }
}
