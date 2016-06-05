<?php

namespace AppBundle\Repository;

class AjusteRepository extends CustomEntityRepository
{
    public function getNbResults()
    {
        return $this->createQueryBuilder('p')
                    ->select('count(p.id)')
                    ->getQuery()
                    ->getSingleScalarResult();
    }

    public function getAjustes()
    {
        $sql = "select * from ajuste";
        $stmt = $this->getEntityManager()
                    ->getConnection()
                    ->prepare($sql);

        $stmt->execute();
        $rows = $stmt->fetchAll();

        $columnVal = array();

        foreach ($rows as $key => $value) {
            $columnVal[$value['clave']] = $value['valor'];
        }

        /*$sql = "SELECT
                    pa.pais_nomb, pa.pais_id,
                    edo.edo_nomb, edo.edo_codi,
                    muni.muni_nomb, muni.muni_codi,
                    parroq.parroq_nomb, parroq.parroq_codi,
                    ald.aldea_nomb, ald.aldea_codi
                    FROM aldea ald
                    INNER JOIN parroquia parroq ON(ald.parroq_codi=parroq.parroq_codi)
                    INNER JOIN municipio muni ON(parroq.muni_codi=muni.muni_codi)
                    INNER JOIN estado edo ON(muni.edo_codi=edo.edo_codi)
                    INNER JOIN pais pa ON(edo.pais_id=pa.pais_id)
                    WHERE ald.aldea_actual=1 LIMIT 0, 1";
        $stmt = $this->getEntityManager()
                    ->getConnection()
                    ->prepare($sql);

        $stmt->execute();
        $rows = $stmt->fetchAll();

        foreach ($rows as $key => $value) {
            $columnVal = array_merge($columnVal, $value);
            $columnVal['webapp_aldea'] = $value['aldea_nomb'];
        }*/

        return $columnVal;
    }
}
