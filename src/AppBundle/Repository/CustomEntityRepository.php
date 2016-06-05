<?php

namespace AppBundle\Repository;

use AppBundle\Util\Utility;
use Doctrine\ORM\EntityRepository;
use Pagerfanta\Adapter\DoctrineORMAdapter;

class CustomEntityRepository extends EntityRepository
{
    public function findByAdapter(array $filters = array(), array $order_by = array(), $q = '', $key_operator = '')
    {
        $fields = array_keys($this->getClassMetadata()->reflFields);

        $qb = $this->createQueryBuilder('c');

        $operatorsLike = Utility::operatorsLike();
        $operatorsNotLike = Utility::operatorsNotLike();

        $sqlOperators = array_merge($operatorsLike, $operatorsNotLike);
        $operatorsLikeKey = array_keys($operatorsLike);
        $operatorsNotLikeKey = array_keys($operatorsNotLike);

        $qLike = false;
        $qNotLike = false;
        $qLikeValue = '';

        foreach ($sqlOperators as $key => $value) {
            if ($key === $key_operator) {
                if (in_array($key, $operatorsNotLikeKey)) {
                    $qNotLike = true;
                } else {
                    $qLike = true;
                }
                $qLikeValue = $value;
            }
        }

        $ORs = array();
        foreach ($fields as $field) {
            if (isset($filters[$field])) {
                if (!empty($filters[$field])) {
                    $qb->andWhere('c.'.$field.'='.$filters[$field]);
                }
                if ($qLike && $qLikeValue) {
                    if (empty($filters[$field])) {
                        $ORs[] = $qb->expr()->like(
                            'c.'.$field,
                            $qb->expr()->literal(sprintf($qLikeValue, $q))
                        );
                    }
                }
                if ($qNotLike && $qLikeValue) {
                    $ORs[] = $qb->expr()->notLike(
                        'c.'.$field,
                        $qb->expr()->literal(sprintf($qLikeValue, $q))
                    );
                }
            }
            if (isset($order_by[$field])) {
                $sortDir = ($order_by[$field] === 'ASC') ? 'ASC' : 'DESC';
                $qb->addOrderBy('c.'.$field, $sortDir);
            }
        }

        $orx = $qb->expr()->orX();
        foreach ($ORs as $or) {
            $orx->add($or);
        }
        $qb->andWhere($orx);

        $adapter = new DoctrineORMAdapter($qb);

        return $adapter;
    }
}
