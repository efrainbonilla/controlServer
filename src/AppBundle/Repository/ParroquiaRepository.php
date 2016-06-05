<?php

namespace AppBundle\Repository;

class ParroquiaRepository extends CustomEntityRepository
{
    public function getNbResults()
    {
        return $this->createQueryBuilder('p')
                    ->select('count(p.parroqCodi)')
                    ->getQuery()
                    ->getSingleScalarResult();
    }
}
