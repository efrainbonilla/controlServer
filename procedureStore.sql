DROP PROCEDURE IF EXISTS getComerciantesBetween;
DELIMITER $$
CREATE PROCEDURE getComerciantesBetween(date_from VARCHAR(10), date_to VARCHAR(10))
BEGIN
	SET @id = '';
	SET @num  = 0;
	SET @date_from = date_from;
	SET @date_to = date_to;
	SELECT
	@num := if(@id = m.razon_social, @num , @num + 1) as nro,
	@id := m.razon_social AS nums,
	g.id, DATE_FORMAT(g.fechsali, '%d/%m/%Y') AS fechsali,
	m.razon_social AS empresa,  CONCAT(mrp.nomb, ' ', mrp.apell, ' ', mrp.telf) AS representante,
	CONCAT(vm.nomb, ' ', vml.nomb, ' ', v.color, ' PLACA ', v.placa) AS vehiculo, CONCAT(p.nomb, ' ', p.apell, ' ', p.naci,'-', p.cedu) AS conductor,
	CONCAT(mcli.razon_social, ', ', zn.zona_nomb, ' ', mclid.av_calle, ' ', mclid.pto_ref) AS destino, CONCAT(mcli.rif_fix, '-', mcli.rif) AS rif_destino, CONCAT(mclirp.nomb, ' ', mclirp.apell, ' ', mclirp.telf) AS contacto, muni.muni_nomb AS _municipio,
	CONCAT(prod.nomb, ' ', marcaprod.nomb, ' ', mmed.nomb, ' ', cp.pres_uni, ' x ', cp.pres_num, ' ', med.nomb) AS rubro, CONCAT(cp.pres_cant) AS cantidad, cp.venta
	FROM _guia_comerciante g
	INNER JOIN _mercantil m ON(g.mercantil_id=m.id)
	LEFT JOIN _mercantil_representante mr ON(mr.mercantil_id=m.id)
	INNER JOIN _persona mrp ON(mr.persona_id=mrp.id)

	INNER JOIN _vehiculo_transporte vt ON(g.id=vt.comerciante_id)

	INNER JOIN _vehiculo v ON(vt.vehiculo_id=v.id)
	INNER JOIN _vehiculo_marca vm ON(v.marca_id=vm.id)
	INNER JOIN _vehiculo_modelo vml ON(v.modelo_id=vml.id)

	INNER JOIN _persona p ON(vt.persona_id=p.id)

	INNER JOIN _transporte_cliente tc ON(tc.transporte_id=vt.id)
	INNER JOIN _mercantil mcli ON(tc.mercantil_id=mcli.id)
	INNER JOIN _mercantil_direccion mclid ON(mclid.mercantil_id=mcli.id)

	LEFT JOIN estado edo ON(mclid.edo_codi=edo.edo_codi)
	LEFT JOIN municipio muni ON(mclid.muni_codi=muni.muni_codi)
	LEFT JOIN zona zn ON(mclid.zona_id=zn.zona_id)

	INNER JOIN _mercantil_representante mclir ON(mclir.mercantil_id=mcli.id)
	INNER JOIN _persona mclirp ON(mclir.persona_id=mclirp.id)

	INNER JOIN _cliente_producto cp ON(cp.cliente_id=tc.id)
	INNER JOIN _producto prod ON(cp.producto_id=prod.id)
	INNER JOIN _producto_marca prodmarca ON(cp.prodmarca_id=prodmarca.id)
	INNER JOIN _marca_producto marcaprod ON(prodmarca.marcaproducto_id=marcaprod.id)

	INNER JOIN _medida med ON(cp.medida_id=med.id)
	INNER JOIN _medida mmed ON(cp.mmedida_id=mmed.id)

	WHERE g.fechsali BETWEEN @date_from AND @date_to

	ORDER BY fechsali ASC;
END $$
DELIMITER ;

/*CALL getComerciantesBetween('2016-05-30', '2016-05-30')*/