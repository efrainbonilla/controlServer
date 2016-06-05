<?php

namespace AppBundle\Repository;

class EstadoRepository extends CustomEntityRepository
{
    public function getNbResults()
    {
        return $this->createQueryBuilder('p')
                    ->select('count(p.edoCodi)')
                    ->getQuery()
                    ->getSingleScalarResult();
    }
}
