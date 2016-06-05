<?php

namespace AppBundle\Repository;

class MercantilRepository extends CustomEntityRepository
{
    public function getNbResults()
    {
        return $this->createQueryBuilder('p')
                    ->select('count(p.id)')
                    ->getQuery()
                    ->getSingleScalarResult();
    }

    public function getTipoMercantil($data = array())
    {
        $sql = 'SELECT
                m.id, m.razon_social,
                CONCAT(m.razon_social, " (", m.rif_fix,"-", m.rif, ")") AS razon_social_rif,
                CONCAT(m.rif_fix,"-", m.rif) AS fix_rif
                FROM _mercantil m
                INNER JOIN _mercantil_tipo mt ON(m.id=mt.mercantil_id)
                INNER JOIN _tipo_mercantil tm ON(mt.tipo_id=tm.id)
                WHERE tm.codi = :codi'
        ;

        $stmt = $this->getEntityManager()
                    ->getConnection()
                    ->prepare($sql);

        $stmt->bindValue('codi', $data['codi']);

        $stmt->execute();

        return $stmt->fetchAll();
    }
}
