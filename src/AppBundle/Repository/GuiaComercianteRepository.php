<?php

namespace AppBundle\Repository;

class GuiaComercianteRepository extends CustomEntityRepository
{
    public function getNbResults()
    {
        return $this->createQueryBuilder('p')
                    ->select('count(p.id)')
                    ->getQuery()
                    ->getSingleScalarResult();
    }

    public function getLastId()
    {
        return $this->createQueryBuilder('p')
                    ->select('MAX(p.id)')
                    ->getQuery()
                    ->getSingleScalarResult();
    }

    public function getComerciantes()
    {
        $sql = "SELECT
                m.id, CONCAT(m.rif_fix,'-', m.rif, ' ', m.razon_social) AS rif_razon_social
                FROM _guia_comerciante g
                INNER JOIN _mercantil m ON(g.mercantil_id=m.id)
                GROUP BY g.mercantil_id
        ";
        $stmt = $this->getEntityManager()
                    ->getConnection()
                    ->prepare($sql);

        //$stmt->bindValue('com_id', 'com_id_aqui');

        $stmt->execute();

        return $stmt->fetchAll();
    }
}
