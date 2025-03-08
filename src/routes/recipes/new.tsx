import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { RecipeForm } from '@/components/RecipeForm'

export const Route = createFileRoute('/recipes/new')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <RecipeForm />
    )
}