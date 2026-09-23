<?php
/**
 * Plugin Name: WPGraphQL ACF Order
 * Description: Ajoute le tri des connexions WPGraphQL sur une valeur ACF.
 * Version: 1.0.0
 * Author: Falézan Thibault
 */

if (!defined('ABSPATH')) {
    exit;
}

add_filter('graphql_input_fields', function (array $fields, string $type_name): array {
    if ($type_name !== 'RootQueryToPostConnectionWhereArgs') {
        return $fields;
    }

    $fields['orderByAcf'] = [
        'type' => 'AcfOrderByInput',
        'description' => 'Trie les articles sur une valeur ACF.',
    ];

    $fields['projectDateRange'] = [
        'type' => 'ProjectDateRangeInput',
        'description' => 'Filtre les projets qui chevauchent une période donnée.',
    ];

    return $fields;
}, 10, 2);

add_action('graphql_register_types', function (): void {
    register_graphql_input_type('AcfOrderByInput', [
        'description' => 'Options de tri sur une valeur ACF.',
        'fields' => [
            'key' => [
                'type' => [
                    'non_null' => 'String',
                ],
                'description' => 'Nom de la meta ACF à utiliser pour le tri.',
            ],
            'order' => [
                'type' => 'OrderEnum',
                'defaultValue' => 'ASC',
                'description' => 'Direction du tri.',
            ],
            'type' => [
                'type' => 'String',
                'defaultValue' => 'CHAR',
                'description' => 'Type SQL de comparaison: CHAR, NUMERIC, DATE ou DATETIME.',
            ],
        ],
    ]);

    register_graphql_input_type('ProjectDateRangeInput', [
        'description' => 'Bornes inclusives de la période de projet.',
        'fields' => [
            'from' => [ 'type' => 'String' ],
            'to' => [ 'type' => 'String' ],
        ],
    ]);
});

add_filter(
    'graphql_post_object_connection_query_args',
    function (array $query_args, $source, array $args): array {
        $project_date_range = $args['where']['projectDateRange'] ?? null;
        if (is_array($project_date_range)) {
            $from = preg_replace('/[^0-9]/', '', (string) ($project_date_range['from'] ?? ''));
            $to = preg_replace('/[^0-9]/', '', (string) ($project_date_range['to'] ?? ''));
            $meta_query = ['relation' => 'AND'];

            // A project overlaps the selected period when it began before its end
            // and has not ended before its start. Projects without an end date are ongoing.
            if ($to !== '') {
                $meta_query[] = [
                    'key' => 'started_at',
                    'value' => $to,
                    'compare' => '<=',
                    'type' => 'DATE',
                ];
            }
            if ($from !== '') {
                $meta_query[] = [
                    'relation' => 'OR',
                    [ 'key' => 'ended_at', 'value' => $from, 'compare' => '>=', 'type' => 'DATE' ],
                    [ 'key' => 'ended_at', 'compare' => 'NOT EXISTS' ],
                    [ 'key' => 'ended_at', 'value' => '', 'compare' => '=' ],
                ];
            }
            if (count($meta_query) > 1) {
                $query_args['meta_query'] = $meta_query;
            }
        }

        $order_by_acf = $args['where']['orderByAcf'] ?? null;

        if (!is_array($order_by_acf) || empty($order_by_acf['key'])) {
            return $query_args;
        }

        $field_name = preg_replace('/[^A-Za-z0-9_-]/', '', (string) $order_by_acf['key']);
        $meta_key = preg_replace('/([a-z])([A-Z])/', '$1_$2', $field_name);
        $meta_key = strtolower($meta_key);
        $order = strtoupper((string) ($order_by_acf['order'] ?? 'ASC'));
        $meta_type = strtoupper((string) ($order_by_acf['type'] ?? 'CHAR'));

        if ($field_name === '' || $meta_key === '') {
            return $query_args;
        }

        if (!in_array($order, ['ASC', 'DESC'], true)) {
            $order = 'ASC';
        }

        if (!in_array($meta_type, ['CHAR', 'NUMERIC', 'DATE', 'DATETIME'], true)) {
            $meta_type = 'CHAR';
        }

        $query_args['meta_key'] = $meta_key;
        $query_args['orderby'] = 'meta_value';
        $query_args['meta_type'] = $meta_type;
        $query_args['order'] = $order;

        return $query_args;
    },
    10,
    3
);
