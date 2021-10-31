package navigator.client

import common.model.Route
import org.glassfish.jersey.SslConfigurator
import javax.ws.rs.client.Client
import javax.ws.rs.client.ClientBuilder
import javax.ws.rs.client.Entity
import javax.ws.rs.core.GenericType
import javax.ws.rs.core.MediaType

class RoutesClient {

    private val ROUTES_URL = "https://localhost:8066/api/routes"

    private val sslContext = SslConfigurator.newInstance()
        .trustStorePassword("payara")
        .keyPassword("payara")
        .createSSLContext()

    private val client: Client =
        ClientBuilder.newBuilder()
            .sslContext(sslContext)
            .hostnameVerifier { hostname, _ -> hostname == "localhost" }
            .build()
    private val target = client.target(ROUTES_URL)

    companion object {
        val instance = RoutesClient()
    }

    fun findRoutesByLocations(fromId: Int? = null, toId: Int? = null, limit: Int? = null): List<Route> {
        var target = target

        if (fromId != null) target = target.queryParam("from.id", fromId)
        if (toId != null) target = target.queryParam("to.id", toId)
        if (limit != null) target = target.queryParam("limit", limit)

        return target
            .request(MediaType.APPLICATION_JSON)
            .get(object : GenericType<List<Route>>() {})
    }

    fun newRoute(route: Route): Route? {
        return target
            .request(MediaType.APPLICATION_JSON)
            .post(Entity.entity(route, MediaType.APPLICATION_JSON))
            .readEntity(Route::class.java)
    }
}