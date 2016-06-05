<?php

namespace AppBundle\Util;

final class Utility
{
    public static function camelCase($str, $exclude = array())
    {
        $str = preg_replace('/[^a-z0-9'.implode('', $exclude).']+/i', ' ', $str);
        // uppercase the first character of each word
        $str = ucwords(trim($str));

        return lcfirst(str_replace(' ', '', $str));
    }

    public static function upperCase($str)
    {
        return null === $str ? null : mb_convert_case($str, MB_CASE_UPPER, mb_detect_encoding($str));
    }

    public static function lowerCase($str)
    {
        return null === $str ? null : mb_convert_case($str, MB_CASE_LOWER, mb_detect_encoding($str));
    }

    public static function titleCase($str)
    {
        return null === $str ? null : mb_convert_case($str, MB_CASE_TITLE, mb_detect_encoding($str));
    }

    public static function operators()
    {
        return array_merge(self::operatorsLike(), self::operatorsNotLike());
    }

    public static function operatorsLike()
    {
        return array(
            'LIKE' => '%s',
            'LIKE ...%' => '%s%%',
            'LIKE %...' => '%%%s',
            'LIKE %...%' => '%%%s%%',
        );
    }

    public static function operatorsNotLike()
    {
        return array(
            'NOT LIKE' => '%s',
            'NOT LIKE ...%' => '%s%%',
            'NOT LIKE %...' => '%%%s',
            'NOT LIKE %...%' => '%%%s%%',
        );
    }
}
