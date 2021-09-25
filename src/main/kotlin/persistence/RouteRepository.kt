package persistence

import model.Route
import servlets.SortType
import util.HibernateSessionFactory
import javax.persistence.criteria.CriteriaBuilder
import javax.persistence.criteria.CriteriaQuery
import javax.persistence.criteria.Root


class RouteRepository {

    val FLOAT_EQUALS_TRESSHOLD = 0.01

    fun getRouteById(routeId: Long): Route {
        val session =
            HibernateSessionFactory.sessionFactory?.openSession() ?: throw Exception("Couldn't create session")
        val transaction = session.beginTransaction() ?: throw Exception("Couldn't create transaction")
        try {
            val route = session.find(Route::class.java, routeId)
            if (route != null) {
                transaction.commit()
                return route
            } else {
                throw NoSuchElementException("No Route found with id = $routeId")
            }
        } catch (e: Exception) {
            transaction.rollback()
            e.printStackTrace()
            throw e
        }
    }

    fun updateRoute(route: Route): Route {
        val session =
            HibernateSessionFactory.sessionFactory?.openSession() ?: throw Exception("Couldn't create session")
        val transaction = session.beginTransaction() ?: throw Exception("Couldn't create transaction")
        try {
            session.update(route)
            transaction.commit()
            return route
        } catch (e: Exception) {
            transaction.rollback()
            e.printStackTrace()
            throw e
        }
    }

    fun addRoute(route: Route): Route {
        val session =
            HibernateSessionFactory.sessionFactory?.openSession() ?: throw Exception("Couldn't create session")
        val transaction = session.beginTransaction() ?: throw Exception("Couldn't create transaction")

        try {
            session.save(route)
            transaction.commit()
            return route
        } catch (e: Exception) {
            transaction.rollback()
            e.printStackTrace()
            throw e
        }
    }

    fun deleteRoute(routeId: Long): Boolean {
        val session =
            HibernateSessionFactory.sessionFactory?.openSession() ?: throw Exception("Couldn't create session")
        val transaction = session.beginTransaction() ?: throw Exception("Couldn't create transaction")
        try {
            val route = session.find(Route::class.java, routeId)

            if (route != null) {
                session.delete(route)
                session.flush()
                transaction.commit()
            } else {
                throw NoSuchElementException("No Route found with id = $routeId")
            }
            return true
        } catch (e: Exception) {
            transaction.rollback()
            e.printStackTrace()
            throw e
        }
    }

    fun filterRoutes(
        sorting: Map<String, SortType>,
        filter: Map<String, String>,
        limit: Int,
        offset: Int
    ): List<Route> {
        val session =
            HibernateSessionFactory.sessionFactory?.openSession() ?: throw Exception("Couldn't create session")
        val criteriaBuilder = session.criteriaBuilder
        val criteriaQuery = criteriaBuilder.createQuery(Route::class.java)

        val root = criteriaQuery.from(Route::class.java)
        criteriaQuery.select(root)
        criteriaQuery.applyFilter(criteriaBuilder, root, filter)
        criteriaQuery.applySorting(criteriaBuilder, root, sorting)

        val query = session.createQuery(criteriaQuery)
        query.firstResult = offset
        query.maxResults = limit

        val results = query.resultList
        println(results)

        return results
    }

    fun deleteWithDistanceEquals(distance: Float): Boolean {
        val session =
            HibernateSessionFactory.sessionFactory?.openSession() ?: throw Exception("Couldn't create session")
        val criteriaBuilder = session.criteriaBuilder
        val criteriaDelete = criteriaBuilder.createCriteriaDelete(Route::class.java)
        val root = criteriaDelete.from(Route::class.java)

        criteriaDelete.where(
            criteriaBuilder.between(
                root["distance"],
                distance - FLOAT_EQUALS_TRESSHOLD,
                distance + FLOAT_EQUALS_TRESSHOLD
            )
        )

        val transaction = session.beginTransaction()
        try {
            session.createQuery(criteriaDelete).executeUpdate()
            transaction.commit()
        } catch (e: Exception) {
            transaction.rollback()
            throw e
        }

        return true
    }

    fun findMinDistance(): Route {
        val session =
            HibernateSessionFactory.sessionFactory?.openSession() ?: throw Exception("Couldn't create session")
        val criteriaBuilder = session.criteriaBuilder
        val criteriaQuery = criteriaBuilder.createQuery(Route::class.java)
        val root = criteriaQuery.from(Route::class.java)

        criteriaQuery.select(criteriaBuilder.min(root["distance"]))

        val transaction = session.beginTransaction()
        try {
            val route = session.createQuery(criteriaQuery).singleResult
            transaction.commit()
            return route
        } catch (e: Exception) {
            transaction.rollback()
            throw e
        }
    }

    fun countWithDistanceLessThan(distance: Float): Long {
        val session =
            HibernateSessionFactory.sessionFactory?.openSession() ?: throw Exception("Couldn't create session")
        val criteriaBuilder = session.criteriaBuilder
        val criteriaQuery = criteriaBuilder.createQuery(Long::class.java)
        val root = criteriaQuery.from(Route::class.java)

        criteriaQuery.select(criteriaBuilder.count(root))
        criteriaQuery.where(criteriaBuilder.lessThan(root["distance"], distance))

        val transaction = session.beginTransaction()
        try {
            val count = session.createQuery(criteriaQuery).singleResult
            transaction.commit()
            return count
        } catch (e: Exception) {
            transaction.rollback()
            throw e
        }
    }

    private fun <T> CriteriaQuery<T>.applyFilter(
        cb: CriteriaBuilder,
        root: Root<T>,
        filter: Map<String, String>
    ): CriteriaQuery<T> {
        if (filter.isEmpty()) return this

        val filterList = filter.entries.map { (field, value) ->
            cb.equal(root.get<String>(field), value)
        }

        where(*filterList.toTypedArray())
        return this
    }

    private fun <T> CriteriaQuery<T>.applySorting(
        cb: CriteriaBuilder,
        root: Root<T>,
        sorting: Map<String, SortType>
    ): CriteriaQuery<T> {
        if (sorting.isEmpty()) return this

        val sortList = sorting.entries.map { (field, sortType) ->
            if (sortType == SortType.ASC) {
                cb.asc(root.get<String>(field))
            } else {
                cb.desc(root.get<String>(field))
            }
        }

        orderBy(sortList)
        return this
    }
}